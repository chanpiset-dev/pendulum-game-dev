/* Original game solver; only export packaging changed for file:// compatibility. */
(function(root){
// --- RK4 Solver and Lagrangian Matrix Solver ---
function solveMatrix(A, b) {
  const n = b.length, x = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let mEl = Math.abs(A[i][i]), mR = i;
    for (let k = i+1; k < n; k++) if (Math.abs(A[k][i]) > mEl) { mEl = Math.abs(A[k][i]); mR = k; }
    for (let k = i; k < n; k++) { const t = A[mR][k]; A[mR][k] = A[i][k]; A[i][k] = t; }
    const tb = b[mR]; b[mR] = b[i]; b[i] = tb;
    if (Math.abs(A[i][i]) < 1e-12) continue;
    for (let k = i+1; k < n; k++) {
      const c = -A[k][i]/A[i][i];
      for (let j=i; j<n; j++) A[k][j] += (i===j) ? 0 : c*A[i][j];
      b[k] += c*b[i];
    }
  }
  for (let i = n-1; i >= 0; i--) {
    if (Math.abs(A[i][i]) < 1e-12) continue;
    x[i] = b[i]/A[i][i];
    for (let k = i-1; k >= 0; k--) b[k] -= A[k][i]*x[i];
  }
  return x;
}

function getDerivs(N, y, L, m, ax = 0, ay = 0, windAx = 0, grav = 9.8, damping = 0.04) {
  const th = y.slice(0, N), w = y.slice(N, 2*N);
  const M = Array.from({length:N}, ()=>new Array(N).fill(0)), B = new Array(N).fill(0);
  const mu = Array.from({length:N}, ()=>new Array(N).fill(0));
  for(let i=0; i<N; i++) for(let j=0; j<N; j++) {
    let s=0; for(let k=Math.max(i,j); k<N; k++) s+=m[k]; mu[i][j]=s;
  }
  for(let i=0; i<N; i++) {
    let t1=0;
    for(let j=0; j<N; j++) {
      M[i][j] = mu[i][j]*L[i]*L[j]*Math.cos(th[i]-th[j]);
      t1 += mu[i][j]*L[i]*L[j]*Math.sin(th[i]-th[j])*w[j]*w[j];
    }
    const effAx = ax - windAx;
    // Scale damping by mu[i][i] * L[i] * L[i] so damping represents an actual 
// velocity-proportional drag coefficient regardless of rod lengths:
    B[i] = -t1 
    - mu[i][i] * (grav - ay) * L[i] * Math.sin(th[i]) 
    - mu[i][i] * effAx * L[i] * Math.cos(th[i]) 
    - mu[i][i] * L[i] * L[i] * damping * w[i];
  }
  return [...w, ...solveMatrix(M, B)];
}

const vAdd = (a,b)=>a.map((v,i)=>v+b[i]);
const vMul = (a,s)=>a.map(v=>v*s);

function rk4(chain, dt, ax = 0, ay = 0, windAx = 0, grav = 9.8, damping = 0.04) {
  const {N, state:y, L, m} = chain;
  const k1 = getDerivs(N, y, L, m, ax, ay, windAx, grav, damping);
  const k2 = getDerivs(N, vAdd(y, vMul(k1, dt/2)), L, m, ax, ay, windAx, grav, damping);
  const k3 = getDerivs(N, vAdd(y, vMul(k2, dt/2)), L, m, ax, ay, windAx, grav, damping);
  const k4 = getDerivs(N, vAdd(y, vMul(k3, dt)), L, m, ax, ay, windAx, grav, damping);
  chain.state = vAdd(y, vMul(vAdd(k1, vAdd(vMul(k2,2), vAdd(vMul(k3,2), k4))), dt/6));
}
root.PendulumPhysics={solveMatrix,getDerivs,rk4};
})(globalThis);
