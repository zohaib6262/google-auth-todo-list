const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { authrouter } = require("./routes/authrouter");
const { todorouter } = require("./routes/todorouter");

const app = express();
const port = process.env.PORT || 3000; // ✅ Dynamic port

app.use(express.json());

// ❌ Redis aur Cron ko comment out karo (Vercel pe nahi chalenge)
// const { redis } = require("./redis");
// const cron = require("node-cron");
// const job = cron.schedule("0 */4 * * *", checkOverdueTodos);

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://google-auth-todo-list-peex.vercel.app",
    "*",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/auth", authrouter);
app.use("/todos", todorouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// ✅ Vercel ke liye export karo
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;

//For this https://kaipod-learning.breezy.hr/p/45f5b5c02652-senior-product-manager/apply
// (async () => {
//   const { GoLogin } = await import("gologin");
//   const GL = new GoLogin({
//     token:
//       "",
//     profile_id: "",
//   });

//   const { wsUrl } = await GL.start();
//   const browser = await puppeteerCore.connect({ browserWSEndpoint: wsUrl });

//   const page = await browser.newPage();
//   await page.goto(
//     // "https://kaipod-learning.breezy.hr/p/45f5b5c02652-senior-product-manager/apply",
//     "https://kaipod-learning.breezy.hr/p/02700a05944e-vp-of-engineering/apply",
//     {
//       waitUntil: "domcontentloaded",
//       timeout: 0,
//     }
//   );

//   const filePathResume = path.resolve(__dirname, "resume.pdf");
//   await page.waitForSelector('.file-input-container > input[name="cResume"]', {
//     timeout: 30000,
//   });
//   const uploadInputs = await page.$(
//     '.file-input-container > input[name="cResume"]'
//   );
//   await uploadInputs.uploadFile(filePathResume);

//   await page.waitForSelector('input[name="cName"]', { timeout: 10000 });
//   await page.type('input[name="cName"]', "Zohaib Ashraf");
//   await page.waitForSelector('input[name="cEmail"]', { timeout: 10000 });
//   await page.type('input[name="cEmail"]', "zohaibbinashrraf@gmail.com");
//   await page.waitForSelector('input[name="cPhoneNumber"]', { timeout: 10000 });
//   await page.type('input[name="cPhoneNumber"]', "0300-9731438");
//   await page.waitForSelector('.option > input[type="checkbox"]', {
//     timeout: 10000,
//   });
//   await page.click('.option > input[type="checkbox"]');
//   await page.waitForSelector('textarea[name="cCoverLetter"]', {
//     timeout: 10000,
//   });
//   await page.type(
//     'textarea[name="cCoverLetter"]',
//     "Hi Dear Hiring Manager, I am excited to apply for the Frontend Development Internship at Kreativstorm. As a highly motivated and progress-focused student pursuing a Bachelor’s degree in Computer Science at Iqra University, I bring a solid foundation in frontend development, coupled with a passion for crafting intuitive and engaging user experiences. "
//   );

//   await page.waitForSelector(
//     'textarea[name="section_1683579710619_question_0"]',
//     { timeout: 10000 }
//   );
//   await page.type(
//     'textarea[name="section_1683579710619_question_0"]',
//     "Your answer here..."
//   );

//   await page.waitForSelector(
//     'select[name="section_1683579710619_question_1"]',
//     { timeout: 10000 }
//   );
//   await page.select('select[name="section_1683579710619_question_1"]', "Yes"); // or 'No'

//   await page.waitForSelector(
//     'select[name="section_1683579710619_question_2"]',
//     { timeout: 10000 }
//   );
//   await page.select('select[name="section_1683579710619_question_2"]', "Yes");
//   await page.waitForSelector(
//     'textarea[name="section_1683579710619_question_3"]',
//     { timeout: 10000 }
//   );
//   await page.type(
//     'textarea[name="section_1683579710619_question_3"]',
//     "Your response here..."
//   );
//   await page.waitForSelector('.apply-button > button[ng-click="apply()"]');

//   await page.click('.apply-button > button[ng-click="apply()"]');
//   await new Promise((resolve) => setTimeout(resolve, 60000));
//   console.log(" Proceeding to close browser...");
//   await browser.close();
//   await GL.stop();
// })();

// (async () => {
//   const { GoLogin } = await import("gologin");
//   const GL = new GoLogin({
//     token:
//       "",
//     profile_id: "",
//     profile_id: "",
//   });

//   const { wsUrl } = await GL.start();
//   const browser = await puppeteerCore.connect({ browserWSEndpoint: wsUrl });

//   const page = await browser.newPage();
//   await page.goto("https://apply.workable.com/subscript/j/5FC789CAD5/apply/", {
//     waitUntil: "networkidle2",
//     timeout: 0,
//   });

//   async function fillField(selector, value) {
//     await page.waitForSelector(selector);
//     await page.click(selector, { clickCount: 3 });
//     await page.keyboard.press("Backspace");
//     await page.type(selector, value);
//   }
//   await fillField('div[data-ui="section-fields"] #firstname', "Zohaib");

//   await fillField('div[data-ui="section-fields"] #lastname', "Ashraf");
//   await fillField(
//     'div[data-ui="section-fields"] #email',
//     "zohaibbinashraaf@gmail.com"
//   );
//   await fillField(
//     'div[data-ui="section-fields"] input[name="phone"]',
//     "3123456789"
//   );
//   await fillField(
//     'div[data-ui="section-fields"] #address',
//     "G-8/2,PARC Colony Pakistan, Islamabad, 04080, Pakistan,"
//   );

//   //For profile picture
//   await page.waitForSelector(
//     'div[data-ui="section-fields"] input[type="file"]'
//   );
//   const fileSection = await page.$('div[data-role="dropzone"] section');

//   if (!fileSection) {
//     const fileInput = await page.$(
//       'div[data-ui="section-fields"] input[type="file"]'
//     );

//     // Upload file from local path
//     await fileInput.uploadFile(path.resolve(__dirname, "profile-image.jpg"));

//     // Wait for crop button to appear
//     await page.waitForSelector(
//       'div[data-role="dialog-actions"] button[data-ui="crop-image"]',
//       {
//         visible: true,
//         timeout: 30000, // Set a timeout if you want, e.g., 30 seconds
//       }
//     );

//     // Click the crop button
//     await page.click(
//       'div[data-role="dialog-actions"] button[data-ui="crop-image"]'
//     );
//   }
//   // Add education section

//   // Wait and click the "+ Add" button in Education section
//   const addButtonSelector =
//     'div[data-ui="education"] button[data-ui="add-section"]';
//   await page.waitForSelector(addButtonSelector, {
//     visible: true,
//     timeout: 0,
//   });

//   await page.click(addButtonSelector);

//   // Disable the button after clicking (for testing)
//   await page.waitForSelector('div[data-ui="education"] #school', {
//     timeout: 0,
//     visible: true,
//   });
//   await fillField(
//     'div[data-ui="education"] #school',
//     "PMAS Arid Agriculture University."
//   );
//   await fillField(
//     'div[data-ui="education"] #field_of_study',
//     "Computer Science"
//   );
//   await fillField('div[data-ui="education"] #degree', "IT");
//   await page.evaluate(() => {
//     document.querySelector(
//       'div[data-ui="education"] input[name="start_date"]'
//     ).value = "";
//     document.querySelector(
//       'div[data-ui="education"] input[name="end_date"]'
//     ).value = "";
//   });
//   const inputSelector = 'div[data-ui="education"] input[name="start_date"]';
//   await page.click(inputSelector);
//   await page.type(inputSelector, "04/2021");
//   const inputSelectorEndDate =
//     'div[data-ui="education"] input[name="end_date"]';
//   await page.click(inputSelectorEndDate);
//   await page.type(inputSelectorEndDate, "03/2025");

//   await page.waitForSelector(
//     'div[data-ui="education"] button[data-ui="save-section"]'
//   );
//   await page.click('div[data-ui="education"] button[data-ui="save-section"]');

//   //Add Experiecnce
//   const experienceAddBtnSelector =
//     'div[data-ui="experience"] button[data-ui="add-section"]';

//   // Wait for the button to appear
//   await page.waitForSelector(experienceAddBtnSelector, {
//     visible: true,
//     timeout: 0,
//   });

//   await page.evaluate((selector) => {
//     const btn = document.querySelector(selector);
//     if (btn) {
//       btn.removeAttribute("disabled");
//       btn.removeAttribute("aria-disabled");
//     }
//   }, experienceAddBtnSelector);

//   await page.click(experienceAddBtnSelector);

//   await fillField(
//     'div[data-ui="experience"] #title',
//     "PMAS Arid Agriculture University."
//   );
//   await fillField('div[data-ui="experience"] #company', "BOP");
//   await fillField('div[data-ui="experience"] #industry', "IT");
//   await fillField(
//     'div[data-ui="experience"] #summary',
//     "That is summary is here........"
//   );

//   await page.evaluate(() => {
//     document.querySelector(
//       'div[data-ui="experience"] input[name="start_date"]'
//     ).value = "";
//     document.querySelector(
//       'div[data-ui="experience"] input[name="end_date"]'
//     ).value = "";
//   });

//   const inputSelector1 = 'div[data-ui="experience"] input[name="start_date"]';
//   await page.click(inputSelector1);
//   await page.type(inputSelector1, "04/2021");
//   const inputSelectorEndDate1 =
//     'div[data-ui="experience"] input[name="end_date"]';
//   await page.click(inputSelectorEndDate1);
//   await page.type(inputSelectorEndDate1, "03/2025");

//   await page.waitForSelector(
//     'div[data-ui="experience"] button[data-ui="save-section"]'
//   );

//   await page.click('div[data-ui="experience"] button[data-ui="save-section"]');

//   //Add for summary and resume
//   await fillField(
//     'div[data-ui="section-fields"] textarea[name="summary"]',
//     "Summmary is here........"
//   );
//   const filePathResume = path.resolve(__dirname, "resume.pdf");
//   const uploadInputResume = await page.$(
//     'div[data-ui="section-fields"] input[data-ui="resume"]'
//   );
//   await uploadInputResume.uploadFile(filePathResume);
//   await fillField(
//     'div[data-ui="section-fields"] textarea[name="cover_letter"]',
//     "Cover letter is here...."
//   );
//   // First fieldset
//   await page.waitForSelector(
//     'fieldset[data-ui="QA_8905581"] input[value="true"]'
//   );
//   await page.click('fieldset[data-ui="QA_8905581"] input[value="true"]');

//   // Short delay in case of dynamic DOM updates

//   // Second fieldset
//   await page.waitForSelector(
//     'fieldset[data-ui="QA_8905582"] input[value="true"]'
//   );
//   await page.click('fieldset[data-ui="QA_8905582"] input[value="true"]');

//   // Third fieldset
//   await page.waitForSelector(
//     'fieldset[data-ui="QA_8905583"] input[value="true"]'
//   );
//   await page.click('fieldset[data-ui="QA_8905583"] input[value="true"]');
//   await page.waitForSelector('button[data-ui="apply-button"]');
//   await page.click('button[data-ui="apply-button"]');

//   await new Promise((resolve) => setTimeout(resolve, 60000));
//   console.log(" Proceeding to close browser...");
//   await browser.close();
//   await GL.stop();
// })();
// app.use("/hotels", todorouter);
