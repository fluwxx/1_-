import { useState, useEffect, useRef } from "react";
import "./MyComponent.css";

function MyComponent() {
    const ref = useRef(null);

    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [prevMouse, setPrevMouse] = useState({ x: 0, y: 0 });

    // Начало перетаскивания ЛКМ
    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // только ЛКМ
        e.preventDefault();
        setIsDragging(true);
        setPrevMouse({ x: e.clientX, y: e.clientY });
        setVelocity({ x: 0, y: 0 }); // сброс скорости
    };

    // Перетаскивание мышью
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        setPosition((pos) => ({
            x: pos.x + dx,
            y: pos.y + dy,
        }));
        setPrevMouse({ x: e.clientX, y: e.clientY });
    };

    // Отпускание мыши — кинуть объект
    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        // скорость по последнему движению мыши
        setVelocity({
            x: (prevMouse.x - position.x) * 0.5,
            y: (prevMouse.y - position.y) * 0.5,
        });
    };

    // Физика с отскоками
    useEffect(() => {
        const id = setInterval(() => {
            if (isDragging) return; // не двигать во время перетаскивания
            setPosition((pos) => {
                const el = ref.current;
                if (!el) return pos;

                const width = el.offsetWidth;
                const height = el.offsetHeight;
                let x = pos.x + velocity.x;
                let y = pos.y + velocity.y;
                let vx = velocity.x;
                let vy = velocity.y;

                const maxX = window.innerWidth - width;
                const maxY = window.innerHeight - height;

                // Отскок по X
                if (x < 0) {
                    x = 0;
                    vx = -vx * 0.8;
                } else if (x > maxX) {
                    x = maxX;
                    vx = -vx * 0.8;
                }

                // Отскок по Y
                if (y < 0) {
                    y = 0;
                    vy = -vy * 0.8;
                } else if (y > maxY) {
                    y = maxY;
                    vy = -vy * 0.8;
                }

                // трение
                vx *= 0.98;
                vy *= 0.98;

                setVelocity({ x: vx, y: vy });

                return { x, y };
            });
        }, 16); // ~60 FPS

        return () => clearInterval(id);
    }, [isDragging, velocity]);

    return (
        <div
            ref={ref}
            className="draggable-component"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ left: position.x, top: position.y }}
        >
            <span>Это мой компонент</span>
            <p>Он отскакивает!</p>
        </div>
    );
}

alert("компонент умеет двигаться")

export default MyComponent;
