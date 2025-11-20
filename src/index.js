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

收到您的來信，我反覆讀了好幾遍。

說實話，一開始有點緊張，但讀完之後更多的是感動。能感受到您字裡行間對正安的愛護，還有對我們的關心，真的很謝謝您願意花時間寫這封信給我。`
        },
        {
            text: `因為是用電子的方式收到這封信，我想了很久該怎麼回覆。後來決定用我覺得最有誠意的方式——也就是現在您看到的這個方式。希望您不會覺得太奇怪，這是我想表達認真看待這件事的心意。`
        },
        {
            text: `關於晚睡這件事，您說的對，我們確實需要調整。這陣子因為我工作的關係，加上正安課業也忙，常常講電話講到很晚才發現時間過了。我們有討論過這個問題，會互相提醒早點休息。您說的一起去圖書館念書是個好主意，這樣我們可以一起待著，但又能各自專心做事，我們會試試看的。`
        },
        {
            text: `正安常常跟我聊到您和正安爸爸。她說小時候您會陪她寫功課、載她上下學，假日會一起出去玩。聽她講這些的時候，我就知道她是在一個很溫暖的家庭長大的。她身上那種善良和貼心，我想都是從您們那邊學來的。`
        },
        {
            text: `我很珍惜跟正安在一起的時間。我們在一起也快要一年了，這段時間裡我們也在學習怎麼相處。有時候會有意見不同的時候，但我們都願意好好講，不會讓事情悶在心裡。我會好好照顧她、尊重她，也會繼續努力讓自己變得更好。`
        },
        {
            text: `寒假的見面我很期待。其實有點緊張，但更多的是希望能有機會讓您和正安爸爸更認識我這個人。到時候有什麼想問的、想聊的，我都會誠實回答。

再次謝謝您的關心和祝福。
我會努力的。`
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

        this.init();
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.createDocument();
        this.setupEventListeners();
        this.animate();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1500);
    }

    setupScene() {
        // Scene with warm dark background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1410);
        this.scene.fog = new THREE.Fog(0x1a1410, 8, 30);

        // Camera - slightly closer for letter viewing
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0.5, 7);
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
        this.renderer.toneMappingExposure = 1.0;

        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Very dim ambient light - creates the spotlight focus effect
        const ambient = new THREE.AmbientLight(0xfff5e6, 0.15);
        this.scene.add(ambient);

        // Main spotlight - warm focused light on the letter
        const mainSpotlight = new THREE.SpotLight(0xfff8e7, 3);
        mainSpotlight.position.set(0, 6, 5);
        mainSpotlight.angle = Math.PI / 6; // Narrower angle for focused spotlight
        mainSpotlight.penumbra = 0.7; // Soft edges
        mainSpotlight.decay = 1.5;
        mainSpotlight.distance = 20;
        mainSpotlight.castShadow = true;
        mainSpotlight.shadow.mapSize.width = 2048;
        mainSpotlight.shadow.mapSize.height = 2048;
        mainSpotlight.shadow.bias = -0.0001;
        this.scene.add(mainSpotlight);

        // Secondary spotlight from above - adds depth
        const topSpotlight = new THREE.SpotLight(0xffe4c4, 1.5);
        topSpotlight.position.set(0, 8, 0);
        topSpotlight.angle = Math.PI / 5;
        topSpotlight.penumbra = 0.8;
        topSpotlight.decay = 2;
        topSpotlight.distance = 15;
        this.scene.add(topSpotlight);

        // Subtle warm rim light
        const rimLight = new THREE.DirectionalLight(0xffd4a3, 0.3);
        rimLight.position.set(-3, 2, -3);
        this.scene.add(rimLight);

        // Very subtle accent light for warmth
        const accentLight = new THREE.PointLight(0xffaa77, 0.5, 8);
        accentLight.position.set(2, 1, 2);
        this.scene.add(accentLight);
    }

    createDocument() {
        const docGroup = new THREE.Group();

        // Create paper stack (fewer pages for a letter)
        const pageCount = 15;
        const pageThickness = 0.008;

        for (let i = 0; i < pageCount; i++) {
            const geometry = new THREE.BoxGeometry(4, 5.5, pageThickness);
            const material = new THREE.MeshStandardMaterial({
                color: 0xfaf6f0,
                roughness: 0.8,
                metalness: 0.05,
                emissive: 0x332211,
                emissiveIntensity: 0.02
            });

            const page = new THREE.Mesh(geometry, material);
            page.position.z = i * pageThickness;
            page.castShadow = true;
            page.receiveShadow = true;

            // Slight variation for realism
            page.rotation.y = (Math.random() - 0.5) * 0.003;

            docGroup.add(page);
        }

        // Create front page with letter content
        this.frontPage = this.createLetterPage();
        this.frontPage.position.z = pageCount * pageThickness + 0.01;
        docGroup.add(this.frontPage);

        // Position document - centered and slightly tilted for reading
        docGroup.position.z = -(pageCount * pageThickness) / 2;
        docGroup.rotation.x = -0.05; // Very slight tilt

        this.scene.add(docGroup);
        this.document = docGroup;
    }

    createLetterPage() {
        // Create canvas for text
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1400;
        const ctx = canvas.getContext('2d');

        // Warm paper background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#fffef9');
        gradient.addColorStop(0.5, '#fefcf5');
        gradient.addColorStop(1, '#faf6f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Paper texture - subtle noise
        ctx.fillStyle = 'rgba(139, 119, 101, 0.015)';
        for (let i = 0; i < 2000; i++) {
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                1, 1
            );
        }

        // Decorative top border - warm elegant line
        const borderGradient = ctx.createLinearGradient(100, 0, canvas.width - 100, 0);
        borderGradient.addColorStop(0, 'rgba(212, 165, 116, 0)');
        borderGradient.addColorStop(0.3, 'rgba(212, 165, 116, 0.6)');
        borderGradient.addColorStop(0.5, 'rgba(212, 165, 116, 0.8)');
        borderGradient.addColorStop(0.7, 'rgba(212, 165, 116, 0.6)');
        borderGradient.addColorStop(1, 'rgba(212, 165, 116, 0)');
        ctx.fillStyle = borderGradient;
        ctx.fillRect(100, 40, canvas.width - 200, 3);

        // Title
        ctx.fillStyle = letterContent.color;
        ctx.font = 'bold 42px "Microsoft JhengHei", "PingFang TC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(letterContent.title, canvas.width / 2, 100);

        // Letter content
        ctx.fillStyle = '#3a3330';
        ctx.font = '26px "Microsoft JhengHei", "PingFang TC", sans-serif';
        ctx.textAlign = 'left';

        const margin = 80;
        const maxWidth = canvas.width - margin * 2;
        const lineHeight = 38;
        let y = 160;

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

        // Bottom decorative line
        ctx.fillStyle = borderGradient;
        ctx.fillRect(100, canvas.height - 50, canvas.width - 200, 2);

        // Create texture and material
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const geometry = new THREE.BoxGeometry(4, 5.5, 0.01);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.7,
            metalness: 0.02,
            emissive: 0x221100,
            emissiveIntensity: 0.02
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Set default cursor
        this.renderer.domElement.style.cursor = 'default';
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Very subtle floating animation - gentle breathing effect
        const time = Date.now() * 0.0003;
        this.document.position.y = Math.sin(time) * 0.02;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new Letter3D();
});
