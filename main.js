const carcanvas = document.getElementById("carCanvas");
carcanvas.width = 200;
const networkcanvas = document.getElementById("networkCanvas");
networkcanvas.width = 300;
const networkctx = networkcanvas.getContext("2d");
const carctx = carcanvas.getContext("2d");
const road = new Road(carcanvas.width / 2, carcanvas.width * 0.9);
const N = 500;
const cars = generate_cars(N);
let best_car = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}
function get_random_speed() {

    return Math.random() * (1 - 0.5) + 0.5;
  }
  
  


function get_random_lane() {
  let choices=[0,1,2]
  return  choices[Math.floor(Math.random() * choices.length)];
}
console.log(get_random_lane())

let traffic = [
  new Car(road.getLaneCenter(2), -400, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -950, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -1200, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -1200, 30, 50, "DUMMY", 3),
];

function repeat_traffic() {
  var min_y = traffic[0];
  for (let i = 0; i < traffic.length; i++) {
    if (traffic[i].y < min_y.y) {
      min_y.y = traffic[i].y;
    }
  }

  if (best_car.y < min_y.y) {
    let newCar = new Car(
      road.getLaneCenter(get_random_lane()), 
      best_car.y - 600, 
      30, 
      50, 
      "DUMMY", 
      get_random_speed() 
    );
   
    traffic.push(newCar);
    traffic.push(newCar);
    
    
      
        
    

    traffic.shift();
    
  }
}

animate();
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(best_car.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generate_cars(N) {
  const cars = [];
  for (let i = 0; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  best_car = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carcanvas.height = window.innerHeight;
  networkcanvas.height = window.innerHeight;
  carctx.save();
  carctx.translate(0, -best_car.y + carcanvas.height * 0.7);

  road.draw(carctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carctx, "red");
  }
  carctx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carctx, "blue");
  }
  carctx.globalAlpha = 1;
  best_car.draw(carctx, "blue", true);

  carctx.restore();
  networkctx.lineDashOffset = time / -50;

  visualizer.draw_network(networkctx, best_car.brain);
  repeat_traffic();

  requestAnimationFrame(animate);
}
