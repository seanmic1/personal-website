/** Procedurally generated buffers, so the page ships with zero audio assets. */

/**
 * Impulse response for the room: noise under an exponential decay, darkened by
 * a one-pole lowpass so it reads as a hall rather than a burst of static, with
 * a short pre-delay of silence in front for a sense of size.
 */
export function makeImpulseResponse(ctx: BaseAudioContext, seconds = 3.2, decay = 2.4) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const preDelay = Math.floor(rate * 0.02);
  const buffer = ctx.createBuffer(2, length, rate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let last = 0;
    for (let i = preDelay; i < length; i++) {
      const envelope = Math.pow(1 - (i - preDelay) / (length - preDelay), decay);
      const white = Math.random() * 2 - 1;
      // one-pole lowpass, ~0.32 coefficient, keeps the tail smooth
      last = last * 0.68 + white * 0.32;
      data[i] = last * envelope;
    }
  }
  return buffer;
}

/**
 * Pink noise via the Paul Kellet approximation. Pink rather than white because
 * white noise swooshes read as hiss; pink reads as air moving.
 */
export function makePinkNoise(ctx: BaseAudioContext, seconds = 2) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const buffer = ctx.createBuffer(1, length, rate);
  const data = buffer.getChannelData(0);

  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }

  // Cross-fade the tail into the head so the loop point is inaudible.
  //
  // Capped at half the buffer: the one-shots ask for bursts shorter than the
  // fade itself (the click's plink is 40ms), and an uncapped fade reads
  // `data[length - fade + i]` off the front of the array. That is `undefined`,
  // which lands in the Float32Array as NaN — and a single NaN sample fed into
  // the shared convolver silences the entire master bus for the whole length
  // of the reverb tail. Clicking a node went quiet for three seconds.
  const fade = Math.min(Math.floor(rate * 0.05), Math.floor(length / 2));
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    data[i] = data[i] * t + data[length - fade + i] * (1 - t);
  }
  return buffer;
}
