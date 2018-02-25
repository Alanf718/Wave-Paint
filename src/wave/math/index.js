export class Mathy {
    constructor() {
    }

    bezier({x1, y1, x2, y2, c}, t) {
        const {pow} = Math;
        if(!c) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
        } else if(c.length === 1) {
            return {
                x: (pow((1 - t), 2) * x1) + 2 * (1 - t) * t * c[0].x + pow(t, 2) * x2,
                y: (pow((1 - t), 2) * y1) + 2 * (1 - t) * t * c[0].y + pow(t, 2) * y2
            };
        }
    }
};

export default Mathy;