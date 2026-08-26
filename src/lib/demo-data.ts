import coffeeImg from "@/assets/cat-coffee.jpg";
import coldImg from "@/assets/cat-cold.jpg";
import teaImg from "@/assets/cat-tea.jpg";
import bakeryImg from "@/assets/cat-bakery.jpg";

export type Priority = "High" | "Medium" | "Low";

export const todayTasks: { task: string; time: string; priority: Priority; owner: string }[] = [
  { task: "Morning staff briefing", time: "07:15", priority: "High", owner: "Sammy" },
  { task: "Inventory check — beans, milk, syrups", time: "09:30", priority: "High", owner: "Thabo" },
  { task: "Supplier follow-up: Cape Bean Roasters", time: "10:30", priority: "High", owner: "Sammy" },
  { task: "Staff scheduling for next week", time: "13:00", priority: "Medium", owner: "Sammy" },
  { task: "Customer feedback review", time: "15:00", priority: "Medium", owner: "Lerato" },
  { task: "Espresso machine descale check", time: "16:30", priority: "Low", owner: "Naledi" },
];

export const pendingEmails = [
  { to: "Cape Bean Roasters", subject: "Late delivery — order #4821", age: "2h" },
  { to: "Nomsa (barista)", subject: "Shift swap request for Friday", age: "5h" },
  { to: "Mr. Daniels (customer)", subject: "Response to feedback card", age: "1d" },
];

export const upcomingMeetings = [
  { title: "Weekly team meeting", when: "Thu 08:00", people: "Full floor team" },
  { title: "Supplier pricing review", when: "Fri 11:00", people: "Cape Bean Roasters" },
  { title: "Winter menu planning", when: "Mon 14:00", people: "Sammy, Lerato, Bakers" },
];

export const staffAvailability = [
  { name: "Thabo M.", role: "Head Barista", status: "On shift" },
  { name: "Lerato K.", role: "Barista", status: "On shift" },
  { name: "Nomsa D.", role: "Barista", status: "Requested swap" },
  { name: "Naledi P.", role: "Baker", status: "Off today" },
  { name: "Sipho R.", role: "Barista", status: "Evening shift" },
];

export const inventory = [
  { item: "Signature blend beans", level: 24, status: "Low" },
  { item: "Full cream milk", level: 68, status: "Healthy" },
  { item: "Oat milk", level: 41, status: "Monitor" },
  { item: "Caramel syrup", level: 15, status: "Low" },
  { item: "Takeaway cups (12oz)", level: 82, status: "Healthy" },
];

export const suppliers = [
  { name: "Cape Bean Roasters", item: "Coffee beans", status: "Delivery delayed" },
  { name: "Dairyland Fresh", item: "Milk & cream", status: "On schedule" },
  { name: "Rise & Bake Co.", item: "Pastries", status: "On schedule" },
  { name: "GreenLeaf Teas", item: "Tea", status: "Order due Friday" },
];

export const recentResearch = [
  "Ways to reduce coffee-shop food waste",
  "Improving customer service at peak hours",
  "Social media marketing ideas for small cafés",
  "Sustainable coffee-shop practices",
];

export const sampleMeetingNotes = `Weekly team meeting — Sammy's Coffee Shop, Tuesday 08:00
Present: Sammy, Thabo, Lerato, Nomsa, Naledi

- Morning rush is peaking 07:30-09:00; queue times reached 9 minutes on Monday. Thabo suggested a second grinder on the bar.
- Agreed to trial a dedicated takeaway till from next Monday for two weeks, Thabo to run the trial.
- Cape Bean Roasters delivery for order #4821 is 3 days late. Sammy will call them and ask for a credit. Needs to happen before Thursday.
- Bakery waste is around 12 muffins a day. Naledi to reduce the afternoon bake by 20% starting this week and track waste for 10 days.
- Winter menu: agreed to add a spiced honey latte. Lerato to cost the recipe by 30 August.
- Nomsa asked for a shift swap on Friday; Sipho agreed to cover. Schedule to be updated by Wednesday.
- Customer feedback: three cards mentioned slow service, two praised the new cinnamon roll.
- Next meeting: Thursday 08:00.`;

export const seedPlannerTasks = [
  { task: "Check inventory", deadline: "Today", priority: "High" as Priority, estimate: "30 min" },
  {
    task: "Contact coffee supplier about late order",
    deadline: "Today",
    priority: "High" as Priority,
    estimate: "20 min",
  },
  {
    task: "Review staff availability",
    deadline: "Today",
    priority: "Medium" as Priority,
    estimate: "25 min",
  },
  {
    task: "Update weekly schedule",
    deadline: "Tomorrow",
    priority: "Medium" as Priority,
    estimate: "45 min",
  },
  {
    task: "Respond to customer feedback",
    deadline: "Tomorrow",
    priority: "Medium" as Priority,
    estimate: "20 min",
  },
  {
    task: "Prepare team meeting agenda",
    deadline: "Thursday",
    priority: "High" as Priority,
    estimate: "30 min",
  },
  { task: "Check equipment", deadline: "Friday", priority: "Low" as Priority, estimate: "40 min" },
  {
    task: "Review sales report",
    deadline: "Friday",
    priority: "Medium" as Priority,
    estimate: "35 min",
  },
];

export type MenuItem = { name: string; desc: string; price: string; image: string };

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Coffee",
    items: [
      {
        name: "Sammy's Signature Latte",
        desc: "House blend, silky steamed milk and a whisper of vanilla.",
        price: "R48",
        image: coffeeImg,
      },
      {
        name: "Classic Cappuccino",
        desc: "Equal parts espresso, milk and velvet foam.",
        price: "R42",
        image: coffeeImg,
      },
      {
        name: "Espresso",
        desc: "A short, bright double shot of our signature roast.",
        price: "R28",
        image: coffeeImg,
      },
      {
        name: "Americano",
        desc: "Espresso lengthened with hot water for a clean finish.",
        price: "R34",
        image: coffeeImg,
      },
      {
        name: "Caramel Macchiato",
        desc: "Layered milk, espresso and slow-cooked caramel.",
        price: "R52",
        image: coffeeImg,
      },
      {
        name: "Mocha",
        desc: "Dark chocolate and espresso, finished with cream.",
        price: "R54",
        image: coffeeImg,
      },
    ],
  },
  {
    category: "Cold Drinks",
    items: [
      {
        name: "Iced Latte",
        desc: "Chilled espresso over ice with cold milk.",
        price: "R50",
        image: coldImg,
      },
      {
        name: "Iced Mocha",
        desc: "Cocoa, espresso and milk poured over crushed ice.",
        price: "R56",
        image: coldImg,
      },
      {
        name: "Cold Brew",
        desc: "Steeped for 16 hours — smooth, low acidity.",
        price: "R52",
        image: coldImg,
      },
      {
        name: "Vanilla Frappé",
        desc: "Blended vanilla, espresso and ice, cream topped.",
        price: "R58",
        image: coldImg,
      },
    ],
  },
  {
    category: "Tea",
    items: [
      {
        name: "English Breakfast Tea",
        desc: "Full-bodied leaf tea served with warm milk.",
        price: "R30",
        image: teaImg,
      },
      {
        name: "Green Tea",
        desc: "Delicate sencha, gently grassy and calming.",
        price: "R32",
        image: teaImg,
      },
      {
        name: "Chai Latte",
        desc: "Spiced masala chai steamed with creamy milk.",
        price: "R46",
        image: teaImg,
      },
    ],
  },
  {
    category: "Bakery",
    items: [
      {
        name: "Butter Croissant",
        desc: "Laminated overnight, baked fresh each morning.",
        price: "R38",
        image: bakeryImg,
      },
      {
        name: "Chocolate Muffin",
        desc: "Dark chocolate chunks in a soft crumb.",
        price: "R36",
        image: bakeryImg,
      },
      {
        name: "Blueberry Muffin",
        desc: "Packed with berries and a crunchy sugar top.",
        price: "R36",
        image: bakeryImg,
      },
      {
        name: "Cinnamon Roll",
        desc: "Warm swirls with cream cheese glaze.",
        price: "R44",
        image: bakeryImg,
      },
      {
        name: "Chocolate Chip Cookie",
        desc: "Chewy centre, crisp edge, sea salt finish.",
        price: "R26",
        image: bakeryImg,
      },
    ],
  },
];
