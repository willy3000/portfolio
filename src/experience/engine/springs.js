// Damped springs stepped by the render loop at a fixed rate. Scroll sets a
// deterministic target; the spring adds inertia and settle on top, so motion
// feels physical but always comes to rest at the same place for the same
// scroll position, in either direction.

const STEP = 1 / 240;

// Response (seconds) and damping ratio, as in lib/motion.js.
const coefficients = (response, dampingRatio) => ({
  stiffness: Math.pow((2 * Math.PI) / response, 2),
  damping: (4 * Math.PI * dampingRatio) / response,
});

export class Spring {
  constructor(value = 0, { response = 0.4, dampingRatio = 1 } = {}) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.configure(response, dampingRatio);
  }

  configure(response, dampingRatio) {
    Object.assign(this, coefficients(response, dampingRatio));
  }

  snap(value = this.target) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  step(dt) {
    let remaining = Math.min(dt, 1 / 20);
    while (remaining > 0) {
      const h = Math.min(STEP, remaining);
      remaining -= h;
      const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
      this.velocity += force * h;
      this.value += this.velocity * h;
    }
    return this.value;
  }
}

// Three springs sharing a configuration, for positions.
export class Spring3 {
  constructor(vector, options) {
    this.x = new Spring(vector.x, options);
    this.y = new Spring(vector.y, options);
    this.z = new Spring(vector.z, options);
  }

  setTarget(v) {
    this.x.target = v.x;
    this.y.target = v.y;
    this.z.target = v.z;
  }

  snap(v) {
    this.x.snap(v.x);
    this.y.snap(v.y);
    this.z.snap(v.z);
  }

  step(dt, out) {
    out.set(this.x.step(dt), this.y.step(dt), this.z.step(dt));
    return out;
  }
}
