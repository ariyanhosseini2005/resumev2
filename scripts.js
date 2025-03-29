feather.replace();

window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 500);
});

const themeOptions = document.querySelectorAll('.theme-option');
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        document.body.setAttribute('data-theme', option.getAttribute('data-theme'));
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    });
});

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));

function updateClock() {
    document.getElementById('clock').textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

let uptime = 0;
setInterval(() => document.getElementById('uptime').textContent = `Uptime: ${uptime++}s`, 1000);

let visits = localStorage.getItem('visits') || 0;
visits++;
localStorage.setItem('visits', visits);
document.getElementById('visits').textContent = `Visits: ${visits}`;

const typingText = document.getElementById('typingText');
const phrases = ["Python Specialist", "Blockchain Architect", "Front-end Innovator", "Tech Visionary"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    if (!isDeleting && charIndex <= currentPhrase.length) {
        typingText.textContent = currentPhrase.substring(0, charIndex++);
        setTimeout(type, 120);
    } else if (isDeleting && charIndex >= 0) {
        typingText.textContent = currentPhrase.substring(0, charIndex--);
        setTimeout(type, 60);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, isDeleting ? 500 : 1500);
    }
}
type();

// بک‌گراند پویا
const gradientCanvas = document.getElementById('gradientCanvas');
const particleCanvas = document.getElementById('particleCanvas');
const gridCanvas = document.getElementById('gridCanvas');
const gradCtx = gradientCanvas.getContext('2d');
const partCtx = particleCanvas.getContext('2d');
const gridCtx = gridCanvas.getContext('2d');

gradientCanvas.width = particleCanvas.width = gridCanvas.width = window.innerWidth;
gradientCanvas.height = particleCanvas.height = gridCanvas.height = window.innerHeight;

// گرادیانت
let gradientAngle = 0;
function drawGradient(mouseX, mouseY) {
    gradientAngle += 0.01;
    const gradient = gradCtx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, Math.max(window.innerWidth, window.innerHeight)
    );
    gradient.addColorStop(0, `rgba(0, 255, 255, ${Math.abs(Math.sin(gradientAngle)) * 0.3})`);
    gradient.addColorStop(1, `rgba(255, 20, 147, ${Math.abs(Math.cos(gradientAngle)) * 0.2})`);
    gradCtx.fillStyle = gradient;
    gradCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
}

// ذرات (بهینه‌شده برای موبایل)
let particles = [];
const particleCount = window.innerWidth <= 768 ? 40 : 80;

class Particle {
    constructor(x, y) {
        this.x = x || Math.random() * particleCanvas.width;
        this.y = y || Math.random() * particleCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.life = 1;
        this.color = Math.random() > 0.5 ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 20, 147, 0.8)';
        this.trail = [];
    }
    update(mouseX, mouseY) {
        this.x += this.speedX + (mouseX - this.x) * 0.01;
        this.y += this.speedY + (mouseY - this.y) * 0.01;
        if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
        
        this.trail.push({ x: this.x, y: this.y, life: this.life });
        if (this.trail.length > 10) this.trail.shift();
    }
    draw() {
        partCtx.beginPath();
        this.trail.forEach((point, i) => {
            partCtx.lineTo(point.x, point.y);
            partCtx.strokeStyle = `${this.color.slice(0, -4)}, ${i / 10})`;
            partCtx.lineWidth = this.size * (i / 10);
            if (i === 0) partCtx.moveTo(point.x, point.y);
            else partCtx.stroke();
        });

        partCtx.fillStyle = this.color;
        partCtx.beginPath();
        partCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        partCtx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                partCtx.strokeStyle = `rgba(255, 215, 0, ${1 - distance / 100})`;
                partCtx.lineWidth = 1;
                partCtx.beginPath();
                partCtx.moveTo(particles[i].x, particles[i].y);
                partCtx.lineTo(particles[j].x, particles[j].y);
                partCtx.stroke();
            }
        }
    }
}

// شبکه 3D
let gridLines = [];
const gridCount = 40;

class GridLine {
    constructor() {
        this.x = Math.random() * gridCanvas.width;
        this.y = Math.random() * gridCanvas.height;
        this.z = Math.random() * 1000 - 500;
        this.speedZ = Math.random() * 0.5 + 0.2;
        this.length = Math.random() * 30 + 20;
        this.angle = Math.random() * Math.PI * 2;
    }
    update(scrollY, mouseX, mouseY) {
        this.z -= this.speedZ + scrollY * 0.005;
        this.angle += 0.02 + (mouseX - gridCanvas.width / 2) * 0.0001;
        if (this.z < -500) this.z = 500;
        if (this.z > 500) this.z = -500;
    }
    draw() {
        const perspective = 1000 / (1000 + this.z);
        const sx = (this.x - gridCanvas.width / 2) * perspective + gridCanvas.width / 2;
        const sy = (this.y - gridCanvas.height / 2) * perspective + gridCanvas.height / 2;
        const length = this.length * perspective;

        gridCtx.strokeStyle = `rgba(0, 255, 255, ${perspective * 0.8})`;
        gridCtx.lineWidth = perspective * 2;
        gridCtx.beginPath();
        gridCtx.moveTo(sx, sy);
        gridCtx.lineTo(
            sx + length * Math.cos(this.angle),
            sy + length * Math.sin(this.angle)
        );
        gridCtx.stroke();
    }
}

function initGrid() {
    for (let i = 0; i < gridCount; i++) gridLines.push(new GridLine());
}
initGrid();

let mouse = { x: particleCanvas.width / 2, y: particleCanvas.height / 2 };
let scrollY = 0;

particleCanvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
particleCanvas.addEventListener('click', (e) => {
    for (let i = 0; i < 15; i++) particles.push(new Particle(e.x, e.y));
});
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    document.querySelector('.scroll-progress').style.width = `${(scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`;
});

function throttle(fn, wait) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn(...args);
        }
    };
}

const animate = throttle(() => {
    drawGradient(mouse.x, mouse.y);
    partCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    partCtx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => {
        p.update(mouse.x, mouse.y);
        p.draw();
    });
    connectParticles();

    gridCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
    gridLines.forEach(g => {
        g.update(scrollY, mouse.x, mouse.y);
        g.draw();
    });

    requestAnimationFrame(animate);
}, 33);
animate();

window.addEventListener('resize', () => {
    gradientCanvas.width = particleCanvas.width = gridCanvas.width = window.innerWidth;
    gradientCanvas.height = particleCanvas.height = gridCanvas.height = window.innerHeight;
    particles = [];
    gridLines = [];
    initParticles();
    initGrid();
});

const nav = document.querySelector('.nav');
const backToTop = document.querySelector('.back-to-top');
const sections = document.querySelectorAll('.section');
const timelineItems = document.querySelectorAll('.timeline-item');
const navLinksItems = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const id = entry.target.getAttribute('id');
            navLinksItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
        }
    });
}, { rootMargin: '0px', threshold: 0.1 });

sections.forEach(section => observer.observe(section));
timelineItems.forEach(item => observer.observe(item));

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 200);
});

backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

$(document).ready(() => {
    $('.downloadBtn').click(async (e) => {
        e.preventDefault();
        $('#overlay').fadeIn(300);
        $('#resumePopup').fadeIn(300);
        const element = document.getElementById('pdf-content');
        const opt = {
            margin: [15, 15, 15, 15],
            filename: 'Ariyan_Hosseini_CV.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
    });

    $('#closePopup, #overlay').click(() => {
        $('#overlay').fadeOut(300);
        $('#resumePopup').fadeOut(300);
    });

    $('#contactForm').submit((e) => {
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            success: () => {
                $('#contactForm')[0].reset();
                alert('Message sent successfully!');
                for (let i = 0; i < 30; i++) particles.push(new Particle(particleCanvas.width / 2, particleCanvas.height - 100));
            },
            error: () => alert('Failed to send message. Please try again.')
        });
    });
});