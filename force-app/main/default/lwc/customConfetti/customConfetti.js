import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getThemeColors from '@salesforce/apex/ConfettiThemeController.getThemeColors';

export default class CustomConfetti extends LightningElement {
    @api recordId;
    @api triggerValue;

    _fieldPath;
    _fields      = [];
    _themeColors = null;
    _recordReady = false;
    _hasFired    = false;

    // fieldPath setter keeps the wire fields array reactive
    @api
    get fieldPath() { return this._fieldPath; }
    set fieldPath(val) {
        this._fieldPath = val;
        this._fields    = val ? [val] : [];
    }

    // themeName setter resets state so a theme change can re-fire
    _themeName;
    @api
    get themeName() { return this._themeName; }
    set themeName(val) {
        this._themeName   = val;
        this._themeColors = null;
        this._hasFired    = false;
    }

    // Load colours from the Confetti_Theme__mdt Custom Metadata record
    @wire(getThemeColors, { developerName: '$_themeName' })
    wiredTheme({ data }) {
        if (data && data.length > 0) {
            this._themeColors = data;
            this._tryLaunch();
        }
    }

    // Watch the configured field on the current record
    @wire(getRecord, { recordId: '$recordId', fields: '$_fields' })
    wiredRecord({ data }) {
        if (data && this._fieldPath && this.triggerValue) {
            const val = getFieldValue(data, this._fieldPath);
            if (val != null && String(val) === String(this.triggerValue)) {
                this._recordReady = true;
                this._tryLaunch();
            }
        }
    }

    // Only launch when both the record condition and theme colours are ready
    _tryLaunch() {
        if (this._recordReady && this._themeColors && !this._hasFired) {
            this._hasFired = true;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => this._launch(), 400);
        }
    }

    _launch() {
        const canvas = this.template.querySelector('canvas');
        if (!canvas) return;

        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors    = this._themeColors;
        const ctx       = canvas.getContext('2d');
        const COUNT     = 220;
        const SHAPES    = 3; // 0 = rectangle, 1 = circle, 2 = diamond
        const particles = [];

        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x:        Math.random() * canvas.width,
                y:        -30 - Math.random() * canvas.height * 0.5,
                w:        Math.random() * 10 + 7,
                h:        Math.random() * 5 + 3,
                color:    colors[i % colors.length],
                shape:    i % SHAPES,
                rot:      Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.13,
                vy:       Math.random() * 3.2 + 1.8,
                vx:       (Math.random() - 0.5) * 2.8,
                wobble:   Math.random() * Math.PI * 2
            });
        }

        const DURATION  = 4800;
        const FADE_FROM = DURATION * 0.65;
        const startTime = performance.now();

        const frame = (now) => {
            const elapsed = now - startTime;
            if (elapsed > DURATION) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            const alpha = elapsed > FADE_FROM
                ? 1 - (elapsed - FADE_FROM) / (DURATION - FADE_FROM)
                : 1;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.y      += p.vy;
                p.x      += p.vx + Math.sin(p.wobble) * 0.6;
                p.wobble += 0.04;
                p.rot    += p.rotSpeed;
                if (p.y > canvas.height + 20) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;

                if (p.shape === 1) {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.shape === 2) {
                    ctx.beginPath();
                    ctx.moveTo(0, -p.h);
                    ctx.lineTo(p.w / 2, 0);
                    ctx.lineTo(0, p.h);
                    ctx.lineTo(-p.w / 2, 0);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                }

                ctx.restore();
            });

            // eslint-disable-next-line @lwc/lwc/no-async-operation
            requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
    }
}
