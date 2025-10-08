const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initAudioVisualizer(container, inputEl, toggleBtn) {
  if (!container || !inputEl || !toggleBtn) return () => {};
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let width, height;
  let audioContext = null;
  let analyser = null;
  let source = null;
  let dataArray = null;
  let animationId = null;
  let isPlaying = false;
  let audioBuffer = null;

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  };

  resize();
  window.addEventListener('resize', resize);

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(14,15,18,0.9)';
    ctx.fillRect(0, 0, width, height);
    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray);
      const sliceWidth = width / dataArray.length;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i] / 255;
        const y = height * (0.2 + value * 0.7);
        ctx.beginPath();
        ctx.moveTo(x, height - y);
        ctx.lineTo(x, height);
        ctx.strokeStyle = `rgba(255,93,162,${0.2 + value * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, height - y - 12, 3 + value * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(211,107,82,${0.3 + value * 0.6})`;
        ctx.fill();
        x += sliceWidth;
      }
    }
    animationId = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (source) {
      source.stop();
      source.disconnect();
      source = null;
    }
    isPlaying = false;
    toggleBtn.textContent = 'Iniciar visual';
  };

  const playBuffer = () => {
    if (!audioBuffer || !audioContext) return;
    stop();
    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    source.start();
    isPlaying = true;
    toggleBtn.textContent = 'Detener visual';
    source.addEventListener('ended', () => {
      isPlaying = false;
      toggleBtn.textContent = 'Repetir visual';
    });
  };

  inputEl.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    playBuffer();
  });

  toggleBtn.addEventListener('click', () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!audioBuffer) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (isPlaying) {
      stop();
    } else {
      playBuffer();
    }
  });

  if (!prefersReduced) {
    animationId = requestAnimationFrame(draw);
  } else {
    ctx.fillStyle = 'rgba(255,93,162,0.2)';
    ctx.fillRect(0, height / 2 - 2, width, 4);
  }

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
    stop();
    if (audioContext) {
      audioContext.close();
    }
  };
}
