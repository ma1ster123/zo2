(function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  let w=0,h=0,t=0;

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }
  addEventListener('resize', resize, {passive:true});
  resize();

  function heartPoint(theta){
    const x = 16*Math.pow(Math.sin(theta),3);
    const y = 13*Math.cos(theta) - 5*Math.cos(2*theta) - 2*Math.cos(3*theta) - Math.cos(4*theta);
    return [x, -y];
  }

  function drawHeart(scale,cx,cy,lineWidth,color,glow){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.beginPath();
    const steps=200;
    for(let i=0;i<=steps;i++){
      const t=i/steps*Math.PI*2;
      const p=heartPoint(t);
      const px=p[0]*scale;
      const py=p[1]*scale;
      if(i===0) ctx.moveTo(px,py);
      else ctx.lineTo(px,py);
    }
    ctx.closePath();

    const glows=[glow*4,glow*2.2,glow*1.0,glow*0.3];
    for(let i=0;i<glows.length;i++){
      ctx.strokeStyle=color;
      ctx.lineWidth=lineWidth+(glows.length-i)*6;
      ctx.globalAlpha=1-i*0.18;
      ctx.shadowColor=color;
      ctx.shadowBlur=glows[i]*18;
      ctx.stroke();
    }

    ctx.globalAlpha=1;
    ctx.lineWidth=Math.max(2,lineWidth*0.6);
    ctx.shadowBlur=0;
    ctx.strokeStyle='#ffd0f0';
    ctx.stroke();
    ctx.restore();
  }

  function clear(){
    ctx.fillStyle='#070007';
    ctx.fillRect(0,0,w,h);

    const g=ctx.createRadialGradient(w*0.5,h*0.45,10,w*0.5,h*0.45,Math.max(w,h));
    g.addColorStop(0,'rgba(40,8,30,0.14)');
    g.addColorStop(1,'rgba(7,0,7,0.75)');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,w,h);
  }

  function animate(){
    t+=0.02;
    clear();

    const baseScale=Math.min(w,h)/60;
    const pulse=1+Math.sin(t*1.8)*0.06;
    const scale=baseScale*pulse;

    const cx=w/2;
    const cy=h/2.2;

    const color=`rgba(255,70,180,1)`;

    drawHeart(scale,cx,cy,Math.max(6,baseScale*0.6),color,1+Math.sin(t*2)*0.15);

    requestAnimationFrame(animate);
  }

  animate();
})();
