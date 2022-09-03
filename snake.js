const game_canvas = document.getElementById("game_canvas");
const game_canvas_context = game_canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }, { x: 170, y: 200 }, { x: 160, y: 200 },];

let x_speed = 10;
let y_speed = 0;

let ended = false;

let score = 0;

var goal_x_pos;
var goal_y_pos;

already_turned = false;

function draw_snake(snakePart) {
    game_canvas_context.fillStyle = 'Gray';
    game_canvas_context.strokestyle = 'Black';
    game_canvas_context.fillRect(snakePart.x, snakePart.y, 10, 10);
    game_canvas_context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function draw() {
    snake.forEach(draw_snake);
}

function redraw_canvas() {
    game_canvas_context.fillStyle = "LightGreen";
    game_canvas_context.strokestyle = "Black";
    game_canvas_context.fillRect(0, 0, game_canvas.width, game_canvas.height);
    game_canvas_context.strokeRect(0, 0, game_canvas.width, game_canvas.height);

    game_canvas_context.fillStyle = 'Yellow';
    game_canvas_context.strokestyle = 'Black';
    game_canvas_context.beginPath();
    game_canvas_context.arc(goal_x_pos+5, goal_y_pos+5, 5, 0, 2 * Math.PI);
    game_canvas_context.fill();
    game_canvas_context.stroke();
}

function update_canvas(got_goal) {
    //Add new head
    const head = { x: snake[0].x + x_speed, y: snake[0].y + y_speed };

    //Put at beginning
    snake.unshift(head);

    //Don't remove last body part when growing
    if (!got_goal) {
        snake.pop();
    }
}

function change_direction(event) {
    if ((event.code === "ArrowLeft" || event.code === "KeyA") && x_speed == 0 && !already_turned) {
        already_turned = true;
        x_speed = -10;
        y_speed = 0;
    } else if ((event.code === "ArrowUp" || event.code === 'KeyW') && y_speed == 0 && !already_turned) {
        already_turned = true;
        x_speed = 0;
        y_speed = -10;
    } else if ((event.code === "ArrowRight" || event.code === 'KeyD') && x_speed == 0 && !already_turned) {
        already_turned = true;
        x_speed = 10;
        y_speed = 0;
    } else if ((event.code === "ArrowDown" || event.code === 'KeyS') && y_speed == 0 && !already_turned) {
        already_turned = true;
        x_speed = 0;
        y_speed = 10;
    }
}

function is_growing() {
    if (snake[0].x == goal_x_pos && snake[0].y == goal_y_pos) {
        return true;
    }
    return false;
}

function create_goal() {
    goal_x_pos = Math.round((Math.random() * (game_canvas.width - 10)) / 10) * 10;
    goal_y_pos = Math.round((Math.random() * (game_canvas.height - 10)) / 10) * 10;
}

function check_failure() {
    //Snake can't collide with any body part less than 4 so start checking there
    for (let i = 4; i < snake.length; i++) {
        if ((snake[i].x == snake[0].x) && (snake[i].y == snake[0].y)) {
            return true;
        }
    }

    //Check wall collisions
    if (snake[0].x < 0 || snake[0].x > game_canvas.width - 10 || snake[0].y < 0 || snake[0].y > game_canvas.height - 10) {
        return true;
    }

    return false;
}

document.addEventListener("keydown", change_direction)

create_goal();
setInterval(function onTick() {
    if (!check_failure()) {
        got_goal = is_growing();
        if (got_goal) {
            document.getElementById('score').innerHTML = "Score: " + ++score;
            create_goal();
        }

        update_canvas(got_goal);
        redraw_canvas();
        draw();
        already_turned = false;
    } else {
        game_canvas_context.font = '60px Arial';
        game_canvas_context.fillStyle = "Black";
        game_canvas_context.textAlign = "center";
        game_canvas_context.fillText("Game Over", game_canvas.height / 2, game_canvas.width / 2);

        if (!ended) {
            restart = document.createElement("button");
            restart.innerHTML = "Restart";
            restart.onclick = function () {
                window.location.reload();
            };
            restart.style.position = "center";
            document.body.appendChild(restart);
        }
        ended = true
    }
}, 100)