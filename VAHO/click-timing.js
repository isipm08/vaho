function clickOnset(buffer) {
  if (!buffer.getChannelData) return 0;
  const samples = buffer.getChannelData(0);
  const limit = Math.min(samples.length, Math.round(buffer.sampleRate * .45));
  let peak = 0;
  for (let i = 0; i < limit; i++) peak = Math.max(peak, Math.abs(samples[i]));
  if (peak < .003) return 0;
  const threshold = peak * .18;
  for (let i = 0; i < limit; i++) {
    if (Math.abs(samples[i]) >= threshold) return Math.max(0, i / buffer.sampleRate - .003);
  }
  return 0;
}
