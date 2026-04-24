import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend, Counter } from "k6/metrics";

// ============================================
// KONFIGURASI - Sesuaikan di sini
// ============================================
const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

const ENDPOINTS = {
  // Ganti dengan endpoint kamu
  get: "/api/todos",
  post: "/api/todos",
};

const POST_BODY = JSON.stringify({
  // Sesuaikan dengan body endpoint POST kamu
  // name: "Test User",
  title: `title_${Math.random()}`,
});

// ============================================
// CUSTOM METRICS
// ============================================
const errorRate = new Rate("error_rate");
const getLatency = new Trend("get_latency", true);
const postLatency = new Trend("post_latency", true);
const totalRequests = new Counter("total_requests");

// ============================================
// SKENARIO - Simulasi traffic normal (sedang)
// ============================================
export const options = {
  scenarios: {
    // Simulasi user normal browsing (GET)
    get_requests: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 20 },  // Ramp up ke 20 users
        { duration: "1m", target: 50 },   // Naik ke 50 users
        { duration: "2m", target: 50 },   // Sustained 50 users
        { duration: "30s", target: 0 },   // Ramp down
      ],
      exec: "getTest",
    },

    // Simulasi user submit data (POST)
    post_requests: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 10 },  // Ramp up ke 10 users
        { duration: "1m", target: 20 },   // Naik ke 20 users
        { duration: "2m", target: 20 },   // Sustained 20 users
        { duration: "30s", target: 0 },   // Ramp down
      ],
      exec: "postTest",
    },
  },

  // Threshold — test dianggap gagal kalau melewati ini
  thresholds: {
    // 95% request harus di bawah 500ms
    http_req_duration: ["p(95)<500"],
    // 99% request harus di bawah 1 detik
    "http_req_duration{type:GET}": ["p(99)<1000"],
    "http_req_duration{type:POST}": ["p(99)<5000"],
    // Error rate tidak boleh lebih dari 5%
    error_rate: ["rate<0.05"],
    // GET latency 95% di bawah 300ms
    // get_latency: ["p(95)<300"],
    // POST latency 95% di bawah 500ms
    // post_latency: ["p(95)<500"],
  },
};

const headers = {
  "Content-Type": "application/json",
  // Tambahkan Authorization kalau endpoint butuh auth
  "Authorization": `Bearer ${__ENV.API_TOKEN}`,
};

// ============================================
// GET TEST
// ============================================
export function getTest() {
  const res = http.get(`${BASE_URL}${ENDPOINTS.get}`, {
    headers,
    tags: { type: "GET" },
  });

  const success = check(res, {
    "GET status 200": (r) => r.status === 200,
    "GET response time < 500ms": (r) => r.timings.duration < 500,
    "GET has body": (r) => r.body && r.body.length > 0,
  });

  errorRate.add(!success);
  getLatency.add(res.timings.duration);
  totalRequests.add(1);

  sleep(1);
}

// ============================================
// POST TEST
// ============================================
export function postTest() {
  const body = JSON.stringify({
    // Sesuaikan dengan body endpoint POST kamu
    // name: "Test User",
    title: `user_${__VU}_${__ITER}@test.com`,
  });

  const res = http.post(`${BASE_URL}${ENDPOINTS.post}`, body, {
    headers,
    tags: { type: "POST" },
  });

  const success = check(res, {
    "POST status 200 or 201": (r) => r.status === 200 || r.status === 201,
    "POST response time < 800ms": (r) => r.timings.duration < 800,
    "POST has body": (r) => r.body && r.body.length > 0,
  });

  errorRate.add(!success);
  postLatency.add(res.timings.duration);
  totalRequests.add(1);

  sleep(2);
}

// ============================================
// SUMMARY REPORT
// ============================================
export function handleSummary(data) {
  const fmt = (val) => (val != null ? val.toFixed(2) : "N/A");
 
  const dur = data.metrics.http_req_duration?.values;
  const get = data.metrics.get_latency?.values;
  const post = data.metrics.post_latency?.values;
  const err = data.metrics.error_rate?.values;
 
  const summary = {
    timestamp: new Date().toISOString(),
    total_requests: data.metrics.total_requests?.values?.count ?? 0,
    error_rate: err ? `${(err.rate * 100).toFixed(2)}%` : "N/A",
    http_req_duration: {
      avg: `${fmt(dur?.avg)}ms`,
      p90: `${fmt(dur?.["p(90)"])}ms`,
      p95: `${fmt(dur?.["p(95)"])}ms`,
      p99: `${fmt(dur?.["p(99)"])}ms`,
    },
    get_latency: {
      avg: `${fmt(get?.avg)}ms`,
      p95: `${fmt(get?.["p(95)"])}ms`,
    },
    post_latency: {
      avg: `${fmt(post?.avg)}ms`,
      p95: `${fmt(post?.["p(95)"])}ms`,
    },
  };
 
  console.log("\n===== LOAD TEST SUMMARY =====");
  console.log(JSON.stringify(summary, null, 2));
 
  return {
    "summary.json": JSON.stringify(summary, null, 2),
    stdout: JSON.stringify(summary, null, 2),
  };
}
