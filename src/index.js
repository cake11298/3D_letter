import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Letter content - 給正安媽媽的回信
const letterContent = {
    title: "給正安媽媽的一封信",
    color: "#d4a574",
    sections: [
        {
            text: `親愛的正安媽媽您好：
                    謝謝您寫這封信給我,您的關心和叮嚀我都收到了。看到您這麼用心地為我們著想,我真的很感動。`
        },
        {
            text: `因為是用電子的方式收到這封信，我想了很久該怎麼回覆。後來決定用我覺得最有誠意的方式——也就是現在您看到的這個方式。希望您不會覺得太奇怪，這是我想表達認真看待這件事的心意。`
        },
        {
            text: `關於晚睡的部分,我會跟正安一起調整作息,確實這陣子因為工作和課業常常通話到很晚,我們會更注意睡眠時間,讓彼此都能有充足的休息。`
        },
        {
            text: `您提到的一起去圖書館讀書寫報告是個很好的建議,我們會試試看這種約會方式,這樣既能陪伴彼此也能兼顧學業。`
        },
        {
            text: `我能理解您作為母親的擔心。正安跟我分享過很多您對她的照顧和教導,我知道她在一個充滿愛的家庭長大,這也是為什麼她是這麼善良體貼的人。`
        },
        {
            text: `我很珍惜能跟正安在一起,也會好好對待她、保護她。我們在相處中也在學習如何溝通和理解彼此,雖然偶爾會有意見不同的時候,但我們都願意好好談開來解決。`
        },
        ,
        {
            text: `寒假的見面我非常期待,很希望能有機會跟您和正安爸爸好好聊聊天,讓您們更認識我。`
        },
        {
            text: `再次謝謝您的關心和祝福,我會努力讓自己成為值得正安託付的人。`
        },


        {
            text: `祝您
身體健康
平安喜樂

智宇 敬上`
        }
    ]
};

class Letter3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.document = null;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.particles = null;

        this.init();
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.createDocument();
        this.createAmbientElements();
        this.setupEventListeners();
        this.animate();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1500);
    }

    setupScene() {
        // Scene with dark background
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
        // Ambient light - slightly brighter for paper visibility
        const ambient = new THREE.AmbientLight(0xfff5e6, 0.4);
        this.scene.add(ambient);

        // Main spotlight - bright warm light on the paper
        const mainSpotlight = new THREE.SpotLight(0xfff8e7, 4);
        mainSpotlight.position.set(0, 5, 8);
        mainSpotlight.angle = Math.PI / 4;
        mainSpotlight.penumbra = 0.5;
        mainSpotlight.decay = 1.5;
        mainSpotlight.distance = 30;
        mainSpotlight.castShadow = true;
        mainSpotlight.shadow.mapSize.width = 2048;
        mainSpotlight.shadow.mapSize.height = 2048;
        this.scene.add(mainSpotlight);

        // Top spotlight for even illumination
        const topLight = new THREE.SpotLight(0xffeedd, 2);
        topLight.position.set(0, 8, 2);
        topLight.angle = Math.PI / 5;
        topLight.penumbra = 0.8;
        topLight.decay = 2;
        topLight.distance = 20;
        this.scene.add(topLight);

        // Warm rim light
        const rimLight = new THREE.DirectionalLight(0xffd4a3, 0.6);
        rimLight.position.set(-5, 3, -5);
        this.scene.add(rimLight);

        // Accent light for warmth
        const accentLight = new THREE.PointLight(0xffaa77, 0.8, 10);
        accentLight.position.set(3, 2, 3);
        this.scene.add(accentLight);
    }

    createDocument() {
        const docGroup = new THREE.Group();

        // Create paper stack
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

        // Create front page with letter content
        this.frontPage = this.createLetterPage();
        this.frontPage.position.z = pageCount * pageThickness + 0.01;
        docGroup.add(this.frontPage);

        // Position document
        docGroup.position.z = -(pageCount * pageThickness) / 2;
        docGroup.rotation.x = -0.1;

        this.scene.add(docGroup);
        this.document = docGroup;
    }

    createLetterPage() {
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

        // Paper texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        for (let i = 0; i < 3000; i++) {
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                1, 1
            );
        }

        // Decorative header bar - warm gold
        ctx.fillStyle = letterContent.color;
        ctx.fillRect(0, 0, canvas.width, 15);

        // Title
        ctx.fillStyle = letterContent.color;
        ctx.font = 'bold 42px "Microsoft JhengHei", "PingFang TC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(letterContent.title, canvas.width / 2, 80);

        // Letter content
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '26px "Microsoft JhengHei", "PingFang TC", sans-serif';
        ctx.textAlign = 'left';

        const margin = 80;
        const maxWidth = canvas.width - margin * 2;
        const lineHeight = 38;
        let y = 130;

        letterContent.sections.forEach((section, index) => {
            const lines = section.text.split('\n');

            lines.forEach(line => {
                if (line.trim() === '') {
                    y += lineHeight * 0.6;
                    return;
                }

                // Word wrap for Chinese text
                const chars = line.split('');
                let currentLine = '';

                for (let i = 0; i < chars.length; i++) {
                    const testLine = currentLine + chars[i];
                    const metrics = ctx.measureText(testLine);

                    if (metrics.width > maxWidth && i > 0) {
                        ctx.fillText(currentLine, margin, y);
                        currentLine = chars[i];
                        y += lineHeight;
                    } else {
                        currentLine = testLine;
                    }
                }
                ctx.fillText(currentLine, margin, y);
                y += lineHeight;
            });

            // Add spacing between sections
            if (index < letterContent.sections.length - 1) {
                y += lineHeight * 0.3;
            }
        });

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

    createAmbientElements() {
        // Create floating particles for warm atmosphere
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Spread particles around but not in front of the paper
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5; // Behind and around

            sizes[i] = Math.random() * 0.05 + 0.02;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xffd4a3,
            size: 0.05,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Add subtle glowing orbs in the background
        for (let i = 0; i < 5; i++) {
            const orbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: 0xffaa66,
                transparent: true,
                opacity: 0.15
            });
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);

            // Position orbs around the scene but not blocking the paper
            orb.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 6,
                -3 - Math.random() * 5
            );

            orb.userData = {
                originalY: orb.position.y,
                speed: 0.3 + Math.random() * 0.3,
                amplitude: 0.2 + Math.random() * 0.3
            };

            this.scene.add(orb);
        }
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse controls for drag rotation
        this.renderer.domElement.addEventListener('mousedown', (event) => {
            this.isDragging = true;
            this.previousMousePosition = { x: event.clientX, y: event.clientY };
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

            this.renderer.domElement.style.cursor = this.isDragging ? 'grabbing' : 'grab';
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.renderer.domElement.style.cursor = 'grab';
        });

        this.renderer.domElement.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Touch support for mobile
        this.renderer.domElement.addEventListener('touchstart', (event) => {
            this.isDragging = true;
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        });

        this.renderer.domElement.addEventListener('touchmove', (event) => {
            if (this.isDragging) {
                const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
                const deltaY = event.touches[0].clientY - this.previousMousePosition.y;

                this.document.rotation.y += deltaX * 0.005;
                this.document.rotation.x += deltaY * 0.005;

                this.document.rotation.x = Math.max(-0.5, Math.min(0.5, this.document.rotation.x));

                this.previousMousePosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
            }
        });

        this.renderer.domElement.addEventListener('touchend', () => {
            this.isDragging = false;
        });

        // Set initial cursor
        this.renderer.domElement.style.cursor = 'grab';
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Subtle floating animation (only when not dragging)
        if (!this.isDragging) {
            this.document.position.y = Math.sin(time * 0.5) * 0.05;
        }

        // Animate particles
        if (this.particles) {
            this.particles.rotation.y = time * 0.02;
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + i) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate background orbs
        this.scene.children.forEach(child => {
            if (child.userData && child.userData.originalY !== undefined) {
                child.position.y = child.userData.originalY +
                    Math.sin(time * child.userData.speed) * child.userData.amplitude;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new Letter3D();
});
