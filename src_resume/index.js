import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Resume pages content - 基於我真實認識的 Gustave
const pages = [
    {
        title: "GUSTAVE YANG",
        subtitle: "楊智宇",
        content: `R&D Software Engineer
Accton Technology Corporation

一個不太一樣的工程師
寫 code 也調酒，打遊戲也彈吉他
在 Belgium 學會了獨立，在台灣持續著折騰

"人活著就是要整活，要折騰一下"`,
        color: "#ff3366"
    },
    {
        title: "WHO I AM",
        content: `我是 Gustave，一個典型的 ENTJ 理工宅。

但「宅」不代表我社恐，
而是我更喜歡有產出的時間利用。

比起參加喝酒派對，
我更想：
• 寫一個新的 Unity 遊戲
• 優化 hardware validation framework
• 彈一首新學的搖滾樂
• 調一杯沒人做過的 cocktail

我創立了學校的調酒社，
帶到 50+ 人。
不是為了社交，
而是因為我想把這件事做好。

這就是我。`,
        color: "#00d9ff"
    },
    {
        title: "WHAT I DO",
        content: `📍 Accton Technology
R&D Software Engineer (2024.07 - Now)

• Python diagnostic systems
• Hardware validation frameworks
• 64-worker parallel memory testing
• Network infrastructure (iperf)
• Log parsing & automation tools
• Full-stack development

技術棧:
Python | JavaScript | React | C/C++
Firebase | Linux | Embedded Systems

我不只是寫 code，
我在建立整個測試基礎設施。
從無到有，從構想到部署。`,
        color: "#7c3aed"
    },
    {
        title: "BELGIUM CHAPTER",
        content: `🇧🇪 Université de Liège
Exchange Student (2024.09 - 2025.06)

這趟旅程教會我的不是法語，
而是「我能否靠自己堅持到底」。

在零下的 Liège 冬日：
→ 自己煮飯（台南飯湯給外國人吃）
→ 自己修水管、電箱
→ 買了把電吉他自我療癒
→ 打遊戲練法語
→ 考過 DELF B1

最後半年幾乎沒跟人說話，
但我過得很充實。
因為我在做自己的事。

這段經歷讓我確認：
我可以在任何地方生存，
而且過得很好。`,
        color: "#ff6b35"
    },
    {
        title: "SIDE PROJECTS",
        content: `🎮 Unity 3D Bartending Game
與團隊開發調酒模擬遊戲
QTE mechanics + Customer AI +
Real cocktail recipes

🔍 Drain3Parser Editor
Multi-user log analysis system
Template matching + Rule processing
Workspace isolation architecture

🍸 Molecular Beverage Research Club
Founder & Leader (50+ members)
把調酒當作 molecular gastronomy
不只是喝，而是理解背後的科學

🎸 Random Projects
Three.js bar simulator
Firebase peer evaluation systems
Arduino shift register displays
課程註冊自動化系統

我的 side projects 都有一個共同點：
它們都解決了真實的問題。`,
        color: "#10b981"
    },
    {
        title: "MY PHILOSOPHY",
        content: `我追求的不是：
✗ 履歷上的裝飾
✗ 別人眼中的成功
✗ 無意義的社交
✗ 標準答案

我追求的是：
✓ 實際的產出
✓ 技術上的突破
✓ 有意義的連結
✓ 持續的挑戰

作為 ENTJ，
我相信「有產出的社交」。

ESN 的酒精路跑？不適合我。
創業社團、開發專案、
建立實驗室人脈？這才是我要的。

我不是社恐，
我只是不想浪費時間在
沒有產出的事情上。`,
        color: "#f59e0b"
    },
    {
        title: "TECH STACK",
        content: `💻 Languages & Frameworks
Python | JavaScript | C/C++ | React
TypeScript | Unity | Three.js

🔧 Systems & Tools
Linux | Firebase | Git
Embedded Systems | Networking
Parallel Computing | Hardware Testing

🗣️ Human Languages
中文 (Native) | English (Fluent)
Français (DELF B1)

🏆 Achievements
ICPC Taiwan Top 30%
LeetCode Active Solver
Hardware Validation Framework Creator
Published Log Analysis Tool

我的技能不是為了面試，
而是為了解決真實世界的問題。

從 low-level hardware testing
到 high-level web applications，
我都能處理。`,
        color: "#ec4899"
    },
    {
        title: "WHAT DRIVES ME",
        content: `💡 Curiosity
為什麼這個系統這樣設計？
能不能做得更好？

🔨 Creation
從零開始建立一個 framework
比使用現成工具更有成就感

🎯 Excellence
做就要做到最好
不然不如不做

🌍 Independence
在 Belgium 證明了：
我可以在任何地方
靠自己活得很好

🎸 Balance
Code 寫累了就彈吉他
調完酒再繼續 debug
這是我的節奏

我不是在找一份「工作」，
我是在找能讓我持續成長、
持續創造價值的機會。`,
        color: "#06b6d4"
    },
    {
        title: "LET'S TALK",
        content: `如果你在找：
• 一個只會執行任務的工程師
• 一個需要手把手教的新人
• 一個「標準」的員工

那我可能不適合。

但如果你在找：
• 一個會主動思考問題的人
• 一個能從零建立系統的人
• 一個在困難中堅持的人
• 一個追求卓越的夥伴

那我們可以聊聊。

📍 Based in Taipei, Taiwan
🌐 Open to remote opportunities
💼 Interested in: Hardware/Software Integration,
    System Architecture, Full-stack Development

我在 Belgium 的冬日學會了堅持，
現在準備好迎接下一個挑戰。

Let's build something great.`,
        color: "#ff3366"
    }
];

class Portfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.document = null;
        this.button = null;
        this.currentPage = 0;
        this.isAnimating = false;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.createDocument();
        this.createButton();
        this.setupEventListeners();
        this.animate();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1000);
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 8);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambient);

        // Main spotlight from front
        const mainLight = new THREE.SpotLight(0xffffff, 2);
        mainLight.position.set(0, 5, 8);
        mainLight.angle = Math.PI / 4;
        mainLight.penumbra = 0.5;
        mainLight.decay = 1.5;
        mainLight.distance = 30;
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0x4466ff, 0.5);
        rimLight.position.set(-5, 3, -5);
        this.scene.add(rimLight);

        // Accent light
        const accentLight = new THREE.PointLight(0xff3366, 1, 10);
        accentLight.position.set(3, 2, 3);
        this.scene.add(accentLight);
    }

    createDocument() {
        const docGroup = new THREE.Group();

        // Create thick document stack
        const pageCount = 30;
        const pageThickness = 0.01;

        for (let i = 0; i < pageCount; i++) {
            const geometry = new THREE.BoxGeometry(4, 5.5, pageThickness);
            const material = new THREE.MeshStandardMaterial({
                color: 0xf5f5f0,
                roughness: 0.7,
                metalness: 0.1,
                emissive: 0x111111,
                emissiveIntensity: 0.1
            });

            const page = new THREE.Mesh(geometry, material);
            page.position.z = i * pageThickness;
            page.castShadow = true;
            page.receiveShadow = true;

            // Add slight variation
            page.rotation.y = (Math.random() - 0.5) * 0.005;

            docGroup.add(page);
        }

        // Create front page with content
        this.frontPage = this.createContentPage(0);
        this.frontPage.position.z = pageCount * pageThickness + 0.01;
        docGroup.add(this.frontPage);

        // Position document
        docGroup.position.z = -(pageCount * pageThickness) / 2;
        docGroup.rotation.x = -0.1;

        this.scene.add(docGroup);
        this.document = docGroup;
    }

    createContentPage(pageIndex) {
        const page = pages[pageIndex];

        // Create canvas for text
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1400;
        const ctx = canvas.getContext('2d');

        // Background with subtle gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f8f8f8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add paper texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        for (let i = 0; i < 3000; i++) {
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                1, 1
            );
        }

        // Decorative header bar
        ctx.fillStyle = page.color;
        ctx.fillRect(0, 0, canvas.width, 20);

        // Title
        ctx.fillStyle = page.color;
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(page.title, canvas.width / 2, 140);

        // Subtitle if exists
        if (page.subtitle) {
            ctx.font = '50px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText(page.subtitle, canvas.width / 2, 210);
        }

        // Content
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '32px Arial';
        ctx.textAlign = 'left';

        const lines = page.content.split('\n');
        let y = page.subtitle ? 300 : 240;
        const lineHeight = 45;
        const margin = 80;
        const maxWidth = canvas.width - margin * 2;

        lines.forEach(line => {
            if (line.trim() === '') {
                y += lineHeight / 2;
                return;
            }

            // Handle special formatting
            if (line.startsWith('•') || line.startsWith('→') || line.startsWith('✓') || line.startsWith('✗')) {
                ctx.font = 'bold 32px Arial';
                const symbol = line[0];
                ctx.fillStyle = page.color;
                ctx.fillText(symbol, margin, y);
                ctx.fillStyle = '#1a1a1a';
                ctx.font = '32px Arial';

                const restOfLine = line.substring(1).trim();
                this.wrapText(ctx, restOfLine, margin + 50, y, maxWidth - 50, lineHeight);
                y += lineHeight * 1.3;
            } else if (line.startsWith('📍') || line.startsWith('🇧🇪') || line.startsWith('🎮') ||
                       line.startsWith('💻') || line.startsWith('💡') || line.startsWith('🔧') ||
                       line.startsWith('🗣️') || line.startsWith('🏆')) {
                ctx.font = 'bold 36px Arial';
                const emoji = line.substring(0, 2);
                ctx.fillText(emoji, margin, y);

                ctx.fillStyle = page.color;
                ctx.font = 'bold 36px Arial';
                const restOfLine = line.substring(2).trim();
                ctx.fillText(restOfLine, margin + 60, y);
                ctx.fillStyle = '#1a1a1a';
                y += lineHeight * 1.5;
            } else {
                ctx.font = '32px Arial';
                this.wrapText(ctx, line, margin, y, maxWidth, lineHeight);
                y += lineHeight;
            }
        });

        // Page number
        ctx.fillStyle = page.color;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${pageIndex + 1} / ${pages.length}`, canvas.width / 2, canvas.height - 40);

        // Create texture and material
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const geometry = new THREE.BoxGeometry(4, 5.5, 0.01);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            metalness: 0.05,
            emissive: 0x222222,
            emissiveIntensity: 0.05
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split('');
        let line = '';
        let currentY = y;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, currentY);
                line = words[i];
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }

    createButton() {
        const buttonGroup = new THREE.Group();

        // Button base (cylinder)
        const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 32);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc0000,
            roughness: 0.3,
            metalness: 0.7,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.castShadow = true;
        buttonGroup.add(base);

        // Button top (pressable part)
        const topGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0xff3333,
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });
        this.buttonTop = new THREE.Mesh(topGeometry, topMaterial);
        this.buttonTop.position.y = 0.12;
        this.buttonTop.castShadow = true;
        buttonGroup.add(this.buttonTop);

        // Add glow ring
        const ringGeometry = new THREE.TorusGeometry(0.45, 0.03, 16, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.08;
        buttonGroup.add(ring);

        // Position button
        buttonGroup.position.set(-3, -1.5, 2);
        buttonGroup.rotation.x = -0.3;

        this.scene.add(buttonGroup);
        this.button = buttonGroup;
        this.buttonPressed = false;
    }

    nextPage() {
        if (this.isAnimating || this.currentPage >= pages.length - 1) return;

        this.isAnimating = true;
        this.currentPage++;

        // Animate page flip
        const oldPage = this.frontPage;

        gsap.to(oldPage.rotation, {
            y: -Math.PI,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                this.document.remove(oldPage);
                oldPage.geometry.dispose();
                oldPage.material.map.dispose();
                oldPage.material.dispose();
            }
        });

        gsap.to(oldPage.position, {
            z: oldPage.position.z - 0.05,
            duration: 1,
            ease: "power2.inOut"
        });

        // Create new page
        setTimeout(() => {
            this.frontPage = this.createContentPage(this.currentPage);
            this.frontPage.position.z = 0.31;
            this.frontPage.rotation.y = Math.PI;
            this.document.add(this.frontPage);

            gsap.to(this.frontPage.rotation, {
                y: 0,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    this.isAnimating = false;
                }
            });
        }, 500);
    }

    pressButton() {
        if (this.buttonPressed || this.isAnimating) return;

        this.buttonPressed = true;

        // Animate button press
        gsap.to(this.buttonTop.position, {
            y: 0.05,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(this.buttonTop.position, {
                    y: 0.12,
                    duration: 0.2,
                    ease: "elastic.out(1, 0.3)",
                    onComplete: () => {
                        this.buttonPressed = false;
                    }
                });
            }
        });

        // Pulse effect
        gsap.to(this.buttonTop.material, {
            emissiveIntensity: 1,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        // Next page
        this.nextPage();
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse controls
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        this.renderer.domElement.addEventListener('mousedown', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(this.buttonTop);

            if (intersects.length > 0) {
                this.pressButton();
            } else {
                this.isDragging = true;
                this.previousMousePosition = { x: event.clientX, y: event.clientY };
            }
        });

        this.renderer.domElement.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                const deltaX = event.clientX - this.previousMousePosition.x;
                const deltaY = event.clientY - this.previousMousePosition.y;

                this.document.rotation.y += deltaX * 0.005;
                this.document.rotation.x += deltaY * 0.005;

                // Clamp rotation
                this.document.rotation.x = Math.max(-0.5, Math.min(0.5, this.document.rotation.x));

                this.previousMousePosition = { x: event.clientX, y: event.clientY };
            }

            // Update cursor
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(this.buttonTop);

            this.renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.renderer.domElement.style.cursor = 'grab';
        });

        // Keyboard
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight' || event.key === ' ') {
                this.pressButton();
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Subtle floating animation
        if (!this.isDragging) {
            this.document.position.y = Math.sin(Date.now() * 0.0005) * 0.05;
            this.document.rotation.y += 0.001;
        }

        // Button glow pulse
        if (!this.buttonPressed) {
            this.buttonTop.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.2;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new Portfolio3D();
});
