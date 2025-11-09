(async () => {
  const { GoLogin } = await import("gologin");
  const GL = new GoLogin({
    token: "",
    profile_id: "",
  });

  const { wsUrl } = await GL.start();
  const browser = await puppeteerCore.connect({ browserWSEndpoint: wsUrl });

  const page = await browser.newPage();
  await page.goto(
    "https://job-boards.greenhouse.io/clipboardhealth/jobs/5426408004",
    {
      waitUntil: "domcontentloaded",
      timeout: 0,
    }
  );
  await page.reload({ waitUntil: "domcontentloaded" });

  const safeType = async (selector, text) => {
    let success = false;
    while (!success) {
      try {
        await page.waitForSelector(selector, { timeout: 20000 });
        await page.type(selector, text);
        success = true;
      } catch (err) {
        success = false;
      }
    }
  };

  await safeType("#first_name", "Zohaib");
  await safeType("#last_name", "Ashraf");
  await safeType("#email", "zohaibbinashraaf@gmail.com");
  await safeType("#phone", "03123456789");

  let resume = false;
  while (!resume) {
    try {
      const resumeFilePath = path.resolve(__dirname, "resume.pdf");
      await page.waitForSelector("#resume", { timeout: 10000 });
      const uploadResume = await page.$("#resume");
      await uploadResume.uploadFile(resumeFilePath);
      resume = true;
    } catch (err) {
      resume = false;
    }
  }
  let cover = false;
  while (!cover) {
    try {
      const coverFilePath = path.resolve(__dirname, "cover_letter.pdf");
      await page.waitForSelector("#cover_letter", { timeout: 10000 });
      const uploadResume = await page.$("#cover_letter");
      await uploadResume.uploadFile(coverFilePath);
      cover = true;
    } catch (err) {
      cover = false;
    }
  }
  //For health list
  let question1 = false;
  while (!question1) {
    try {
      await page.waitForSelector(
        '[id="question_12496665004-label"]+div button',
        {
          timeout: 10000,
        }
      );
      await page.click('[id="question_12496665004-label"]+div button');
      await page.waitForSelector(
        '[id="react-select-question_12496665004-listbox"] [id="react-select-question_12496665004-option-0"]',
        { timeout: 10000 }
      );
      await page.click(
        '[id="react-select-question_12496665004-listbox"] [id="react-select-question_12496665004-option-0"]'
      );
      question1 = true;
    } catch (err) {
      question1 = false;
    }
  }

  //For pakistan
  await safeType("#question_12496666004", "Pakistan");
  //For residence
  let question3 = false;
  while (!question3) {
    try {
      await page.waitForSelector(
        '[id="question_13185886004-label"]+div button',
        {
          timeout: 4000,
        }
      );

      await page.click('[id="question_13185886004-label"]+div button');
      await page.waitForSelector(
        '[id="react-select-question_13185886004-listbox"] [id="react-select-question_13185886004-option-1"]'
      );
      await page.click(
        '[id="react-select-question_13185886004-listbox"] [id="react-select-question_13185886004-option-1"]'
      );
      question3 = true;
    } catch (err) {
      question3 = false;
    }
  }
  await safeType(
    '[aria-label="What is your expected gross compensation per year (annually) in USD?"]',
    "15000"
  );

  //For residence
  let question4 = false;
  while (!question4) {
    try {
      await page.waitForSelector(
        '[id="question_12496668004[]-label"]+div button',
        {
          timeout: 4000,
        }
      );
      await page.click('[id="question_12496668004[]-label"]+div button');
      await page.waitForSelector(
        '[id="react-select-question_12496668004[]-listbox"] [id="react-select-question_12496668004[]-option-0"]',
        { timeout: 10000 }
      );
      await page.click(
        '[id="react-select-question_12496668004[]-listbox"] [id="react-select-question_12496668004[]-option-0"]'
      );

      question4 = true;
    } catch (err) {
      question4 = false;
    }
  }

  //For Inquiry
  let question5 = false;
  while (!question5) {
    try {
      await page.waitForSelector(
        '[id="question_12496673004-label"]+div button',
        {
          timeout: 4000,
        }
      );

      await page.click('[id="question_12496673004-label"]+div button');
      await page.waitForSelector(
        '[id="react-select-question_12496673004-listbox"] [id="react-select-question_12496673004-option-0"]',
        { timeout: 10000 }
      );
      await page.click(
        '[id="react-select-question_12496673004-listbox"] [id="react-select-question_12496673004-option-0"]'
      );

      question5 = true;
    } catch (err) {
      question5 = false;
    }
  }
  //For CRM tools
  let question6 = false;
  while (!question6) {
    try {
      await page.waitForSelector(
        '[id="question_13166074004-label"]+div button',
        {
          timeout: 4000,
        }
      );

      await page.click('[id="question_13166074004-label"]+div button');
      await page.waitForSelector(
        '[id="react-select-question_13166074004-listbox"] [id="react-select-question_13166074004-option-0"]',
        { timeout: 10000 }
      );
      await page.click(
        '[id="react-select-question_13166074004-listbox"] [id="react-select-question_13166074004-option-0"]'
      );

      question6 = true;
    } catch (err) {
      question6 = false;
    }
  }

  //For PST
  let question7 = false;
  while (!question7) {
    try {
      await page.waitForSelector(
        '[id="question_12496670004[]-label"]+div button',
        {
          timeout: 4000,
        }
      );

      await page.click('[id="question_12496670004[]-label"]+div button');
      await page.waitForSelector(
        '[id="react-select-question_12496670004[]-listbox"] [id="react-select-question_12496670004[]-option-0"]',
        { timeout: 10000 }
      );
      await page.click(
        '[id="react-select-question_12496670004[]-listbox"] [id="react-select-question_12496670004[]-option-0"]'
      );
      question7 = true;
    } catch (err) {
      question7 = false;
    }
  }

  //For Selection process
  let question8 = false;
  while (!question8) {
    try {
      await page.waitForSelector(
        '[id="question_12496672004-label"]+div button',
        {
          timeout: 4000,
        }
      );

      await page.click('[id="question_12496672004-label"]+div button');
      await page.waitForSelector(
        '[id="react-select-question_12496672004-listbox"] [id="react-select-question_12496672004-option-0"]',
        { timeout: 10000 }
      );
      await page.click(
        '[id="react-select-question_12496672004-listbox"] [id="react-select-question_12496672004-option-0"]'
      );
      question8 = true;
    } catch (err) {
      question8 = false;
    }
  }

  //For Selection process
  let question9 = false;
  while (!question9) {
    try {
      await page.waitForSelector(
        '[id="question_12496674004-label"]+div button',
        {
          timeout: 4000,
        }
      );

      await page.click('[id="question_12496674004-label"]+div button');
      await page.waitForSelector(
        '[id="react-select-question_12496674004-listbox"] [id="react-select-question_12496674004-option-0"]',
        { timeout: 10000 }
      );
      await page.click(
        '[id="react-select-question_12496674004-listbox"] [id="react-select-question_12496674004-option-0"]'
      );

      question9 = true;
    } catch (err) {
      question9 = false;
    }
  }
  await safeType(
    '[aria-label="How did you hear about this position?"]',
    "From LinkedIn"
  );

  //For Button
  let button = false;
  while (!button) {
    try {
      await page.waitForSelector('button[type="submit"]', {
        timeout: 4000,
      });

      await page.click('button[type="submit"]');

      button = true;
    } catch (err) {
      button = false;
    }
  }
  console.log("Job form submitted!");
  console.log(
    "🛂 Please enter the verification code manually in the browser..."
  );
  console.log("⏳ Waiting 30 seconds before closing browser...");

  await new Promise((resolve) => setTimeout(resolve, 60000));

  console.log("Proceeding to close browser...");
  await browser.close();
  await GL.stop();
})();
