import kaplay from "kaplay";
import "kaplay/global"; // uncomment if you want to use without the k. prefix

kaplay({
    width: 640,
    height: 480,
    font: "cursive",
    background: [ 227, 242, 255 ],
})

loadSprite("buttertoast", "sprites/ob-buttertoast.png");
loadSprite("chiikawa", "sprites/ob-chiikawa.png");
loadSprite("usagi", "sprites/ob-usagi.png");
loadSprite("usagi2", "sprites/ob-usagi2.png");
loadSprite("momong", "sprites/ob-momong.png");
loadSprite("rakko", "sprites/ob-rakko.png");
loadSprite("sadhachiware", "sprites/sad-hachiware.jpg")
loadSprite("bg", "sprites/bg.png")
loadSprite("grass", "sprites/bg-grass.png")
loadSprite("bgmenu", "sprites/bg-pause-death.png")
loadSprite("pause", "sprites/pause-o.png")
loadSprite("play", "sprites/play-o.png")

loadSound("jump", "sounds/jump.mp3")
loadSound("click", "sounds/click.mp3")
loadSound("loss", "sounds/loss.mp3")

loadSprite ("hachiware", "sprites/hachiware-run-sprites.png", {
    sliceX: 6,
    anims: {
        run: {
            from: 0,
            to: 5,
            loop: true,
            speed: 12,    
        },
    },
});

let score = 0;
let highscore = 0;

scene("start", () => {
    add([
        sprite("bgmenu")
    ])
    
    add([
        text("hachiware game", {
            size: 72,
        }),
        color(0,0,0),
        pos(85, 130)
    ])
    const gotogame = add([
        text("click me to play!", {
            size: 38,
        }),
        color(0,0,0),
        pos(330, 220),
        area(),
        "gotogame",
    ])
    const hachiware = add([
        sprite("hachiware", {
            anim: "run",
        }),
        pos(150, 300),
        scale(4),
        anchor("center"),
        area(),
        body(),
        "hachiware",
    ]);

    onClick("gotogame", () => {
        play("click");
        go("game");
    })
})

go("start");

scene("game", () => {
    setGravity(1200); // Example gravity amount 
    
    add([
        sprite("bg"),
    ])

    const pauseBtn = add([
        sprite("pause"),
        pos(585, 50),
        anchor("center"),
        scale(0.75),
        area(),
        "pauseBtn",
    ])

    onHover("pauseBtn", () => {
        pauseBtn.scale = vec2(0.9);
    })
    onHoverEnd("pauseBtn", () => {
        pauseBtn.scale = vec2(0.75);
    })

    onClick("pauseBtn", () => {
        play("click");
        go("pause");
    })

    const hachiware = add([
        sprite("hachiware", {
            anim: "run",
        }),
        pos(85, 100),
        scale(2),
        anchor("center"),
        area(),
        body(),
        "hachiware",
    ]);

    const scoreLabel = add([
        text(score),
        pos(20,20),
    ]);

    const opps = [];

    function addOpp() {
        const options = ["buttertoast","chiikawa","usagi","usagi2","momong","rakko"];
        const index = Math.floor(rand(0, options.length));
        const randomSprite = options[index];

        let spawnX = 600;
        let spawnY = 300;

        const newOpp = add([
            sprite(randomSprite),
            pos(spawnX, spawnY),
            anchor("bot"),
            scale(0.1),            
            area(),
            z(1),
            "opp",
            {speed: rand(25000, 30000)},
        ]);

        opps.push(newOpp);
    }

    loop(1.5, () => {
        addOpp();
    });

    loop(0.15, () => {
        score++;
        scoreLabel.text = String(score);
    });

    onUpdate(() => {
    for (let i = opps.length - 1; i >= 0; i--) {
        const e = opps[i];
        e.move(-e.speed * dt(), 0);

        // remove if off-screen
        if (e.pos.x < -50) {
            destroy(e);
            opps.splice(i, 1);
        }
       }
    });

    add([
        rect(700, 32),
        pos(0, 290),
        area(),
        body({ isStatic: true }),
        opacity(),   // invisible
    ]);

    const floor = add([
        sprite("grass"),
        pos(0, 280),
    ]);

    onKeyPressRepeat(["up", "space"], () => {
        play("jump");
        if (hachiware.isGrounded()) {
            hachiware.jump(550);
        }
    }); 

    onCollide("hachiware", "opp", () => { 
        highscore = Math.max(highscore, score);
        play("loss");
        wait(0.05, () => {
             go("dead"); 
            })
        })
})

scene("dead", () => {
    score = 0;
    add ([
        sprite("bgmenu"),
    ])
    
    const sadhachiware = add ([
        sprite("sadhachiware"),
        pos(20, 50),
        area(),
        "sadhachiware",
    ])
    add ([
        text("you died rip", {
            width: (180),
            align: "center",
        }),
        color(0,0,0),
        pos(425, 50),
    ])

    add ([
        text("click upside down hachiware to restart", {
            width: (180),
            align: "center",
        }),
        color(0,0,0),
        pos(425, 170),
    ])
    
    add([
        text("your highscore: " + highscore, {
            align: "center",
        }),
        color(0,0,0),
        anchor("center"),
        pos(175, 445)
    ])

    onClick("sadhachiware", () => {
        play("click");
        go("game");
    })
})

scene("pause", () => {
    add ([
        sprite("bgmenu"),
    ])
    
    const playBtn = add([
        sprite("play"),
        pos(585, 50),
        anchor("center"),
        scale(0.75),
        area(),
        "playBtn",
    ])

    onHover("playBtn", () => {
        playBtn.scale = vec2(0.9);
    })
    onHoverEnd("playBtn", () => {
        playBtn.scale = vec2(0.75);
    })

    onClick("playBtn", () => {
        play("click");
        go("game");
    })

    add([
        text("your highscore: " + highscore, {
            align: "center",
        }),
        color(0,0,0),
        anchor("center"),
        pos(320, 150)
    ])

    add([
        text("your game is paused", {
            align: "center",
        }),
        color(0,0,0),
        anchor("center"),
        pos(320, 200)
    ])
    add([
        text("press play in the corner to return to the game", {
            align: "center",
            width: 300,
        }),
        color(0,0,0),
        anchor("center"),
        pos(320, 300)
    ])    
})