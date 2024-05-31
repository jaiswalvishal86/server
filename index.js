import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
// import serverless from "serverless-http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const apiToken = process.env.API_TOKEN;

if (!apiToken) {
  console.error(
    "API token is missing. Please set the API_TOKEN environment variable."
  );
  process.exit(1);
}

app.use(bodyParser.json());

app.use(cors());

app.post("/api/submit-form", async (req, res) => {
  const data = req.body;

  try {
    let organizationId = null;
    let personId = null;

    if (data.company.length >= 2) {
      const searchResponse = await axios.get(
        `https://api.pipedrive.com/v1/organizations/search`,
        {
          params: { term: data.company, api_token: apiToken },
        }
      );
      const searchData = searchResponse.data;
      if (searchData.success && searchData.data.items.length > 0) {
        organizationId = searchData.data.items[0].item.id;
      } else {
        const orgResponse = await axios.post(
          `https://api.pipedrive.com/v1/organizations`,
          { name: data.company },
          { params: { api_token: apiToken } }
        );
        const orgData = orgResponse.data;
        if (orgData.success) {
          organizationId = orgData.data.id;
        }
      }
    }

    if (organizationId) {
      const personData = {
        name: data.name,
        email: [{ value: data.email, primary: true }],
        phone: data.phone,
        org_id: organizationId,
      };

      const personResponse = await axios.post(
        `https://api.pipedrive.com/v1/persons`,
        personData,
        { params: { api_token: apiToken } }
      );
      const personJsonData = personResponse.data;
      if (personJsonData.success) {
        personId = personJsonData.data.id;
      }
    }

    // Create lead
    if (personId && organizationId) {
      const leadData = {
        title: `New Lead from ${data.formName}`,
        person_id: personId,
        organization_id: organizationId,
        "856d510f94582b0d7d7ce7b22628d5287c8d0e6a": data.code,
        "5fd6a4e3043b2f7083183f47c8b3e7ffd71c0c9d": data.designation,
      };

      const leadResponse = await axios.post(
        `https://api.pipedrive.com/v1/leads`,
        leadData,
        { params: { api_token: apiToken } }
      );
      const leadResponseData = leadResponse.data;
      if (leadResponseData.success) {
        res.status(200).json({ message: "Form submitted successfully!" });
      } else {
        res
          .status(500)
          .json({ message: "Failed to submit form.", error: leadResponseData });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing form data", error: error.message });
  }
});

app.post("/api/popup-form", async (req, res) => {
  const data = req.body;

  let organizationId = null;
  let personId = null;

  const orgResponse = await axios.post(
    `https://api.pipedrive.com/v1/organizations`,
    { name: "UPDOT" },
    { params: { api_token: apiToken } }
  );
  const orgData = orgResponse.data;
  if (orgData.success) {
    organizationId = orgData.data.id;
  }

  if (organizationId) {
    const personData = {
      name: data.name,
      email: [{ value: data.email, primary: true }],
      phone: data.phone,
      org_id: organizationId,
    };

    const personResponse = await axios.post(
      `https://api.pipedrive.com/v1/persons`,
      personData,
      { params: { api_token: apiToken } }
    );
    const personJsonData = personResponse.data;
    if (personJsonData.success) {
      personId = personJsonData.data.id;
    }
  }

  if (personId && organizationId) {
    const leadData = {
      title: `New Lead from ${data.formName}`,
      person_id: personId,
      organization_id: organizationId,
      "856d510f94582b0d7d7ce7b22628d5287c8d0e6a": data.code,
      "05ffd2968a78543c2c6092c73ca718f915281197": data.message,
    };

    const leadResponse = await axios.post(
      `https://api.pipedrive.com/v1/leads`,
      leadData,
      { params: { api_token: apiToken } }
    );
    const leadResponseData = leadResponse.data;
    if (leadResponseData.success) {
      res.status(200).json({ message: "Form submitted successfully!" });
    } else {
      res
        .status(500)
        .json({ message: "Failed to submit form.", error: leadResponseData });
    }
  }
});

app.post("/api/contact-form", async (req, res) => {
  const data = req.body;

  try {
    let organizationId = null;
    let personId = null;

    if (data.company.length >= 2) {
      const searchResponse = await axios.get(
        `https://api.pipedrive.com/v1/organizations/search`,
        {
          params: { term: data.company, api_token: apiToken },
        }
      );
      const searchData = searchResponse.data;
      if (searchData.success && searchData.data.items.length > 0) {
        organizationId = searchData.data.items[0].item.id;
      } else {
        const orgResponse = await axios.post(
          `https://api.pipedrive.com/v1/organizations`,
          { name: data.company },
          { params: { api_token: apiToken } }
        );
        const orgData = orgResponse.data;
        if (orgData.success) {
          organizationId = orgData.data.id;
        }
      }
    }

    if (organizationId) {
      const personData = {
        name: data.name,
        email: [{ value: data.email, primary: true }],
        phone: data.phone,
        org_id: organizationId,
      };

      const personResponse = await axios.post(
        `https://api.pipedrive.com/v1/persons`,
        personData,
        { params: { api_token: apiToken } }
      );
      const personJsonData = personResponse.data;
      if (personJsonData.success) {
        personId = personJsonData.data.id;
      }
    }

    // Create lead
    if (personId && organizationId) {
      const leadData = {
        title: `New Lead from ${data.formName}`,
        person_id: personId,
        organization_id: organizationId,
        "856d510f94582b0d7d7ce7b22628d5287c8d0e6a": data.code,
        "05ffd2968a78543c2c6092c73ca718f915281197": data.message,
        "a1150e64811fbc3a7d1722af03cb79f9f81d2d2e": data.industries,
        "5e99575c1a03dbb790c50e7429b7589d46d9e996": data.company_website,
        "53790a4b55d0f6e236b0994e075e24fcfdac6b59": data.web_development,
        "4fbf87f81e0634371d944eacd7d9a2e4d57c80e5": data.app_development,
        "ba88fff9a3559e77757db9aaef59d116e89538b7": data.ui_ux_design,
        "f04fdf9e3e2ed10c0e08dbf3ee1a06d765f29062": data.dev_ops_cloud,
        "debe0db18bd925136826b8d52b86e2a4b5135248": data.seo,
        "ee1515a4a48dd3121b08392266defb4d12a2ff77": data.ar_vr,
        "2e18c16492c868c5e893b531907d250719e7ff5f": data.maintenance_upgrade,
        "e2639af860c19bce1dac62b1804d02c8719f7140": data.game_development,
      };

      const leadResponse = await axios.post(
        `https://api.pipedrive.com/v1/leads`,
        leadData,
        { params: { api_token: apiToken } }
      );
      const leadResponseData = leadResponse.data;
      if (leadResponseData.success) {
        res.status(200).json({ message: "Form submitted successfully!" });
      } else {
        res
          .status(500)
          .json({ message: "Failed to submit form.", error: leadResponseData });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing form data", error: error.message });
  }
});


app.post("/api/clutch-top-form", async (req, res) => {
  const data = req.body;

  let organizationId = null;
  let personId = null;

  const orgResponse = await axios.post(
    `https://api.pipedrive.com/v1/organizations`,
    { name: "UPDOT" },
    { params: { api_token: apiToken } }
  );
  const orgData = orgResponse.data;
  if (orgData.success) {
    organizationId = orgData.data.id;
  }

  if (organizationId) {
    const personData = {
      name: data.name,
      email: [{ value: data.email, primary: true }],
      phone: 123456789,
      org_id: organizationId,
    };

    const personResponse = await axios.post(
      `https://api.pipedrive.com/v1/persons`,
      personData,
      { params: { api_token: apiToken } }
    );
    const personJsonData = personResponse.data;
    if (personJsonData.success) {
      personId = personJsonData.data.id;
    }
  }

  if (personId && organizationId) {
    const leadData = {
      title: `New Lead from ${data.formName}`,
      person_id: personId,
      organization_id: organizationId,
      "e8be7d07dc0a0bd4431410e0ec19fabd918399c2": data.services,
    };

    const leadResponse = await axios.post(
      `https://api.pipedrive.com/v1/leads`,
      leadData,
      { params: { api_token: apiToken } }
    );
    const leadResponseData = leadResponse.data;
    if (leadResponseData.success) {
      res.status(200).json({ message: "Form submitted successfully!" });
    } else {
      res
        .status(500)
        .json({ message: "Failed to submit form.", error: leadResponseData });
    }
  }
});


app.post("/api/landing-bottom-form", async (req, res) => {
  const data = req.body;

  try {
    let organizationId = null;
    let personId = null;

    if (data.company.length >= 2) {
      const searchResponse = await axios.get(
        `https://api.pipedrive.com/v1/organizations/search`,
        {
          params: { term: data.company, api_token: apiToken },
        }
      );
      const searchData = searchResponse.data;
      if (searchData.success && searchData.data.items.length > 0) {
        organizationId = searchData.data.items[0].item.id;
      } else {
        const orgResponse = await axios.post(
          `https://api.pipedrive.com/v1/organizations`,
          { name: data.company },
          { params: { api_token: apiToken } }
        );
        const orgData = orgResponse.data;
        if (orgData.success) {
          organizationId = orgData.data.id;
        }
      }
    }

    if (organizationId) {
      const personData = {
        name: data.name,
        email: [{ value: data.email, primary: true }],
        phone: data.phone,
        org_id: organizationId,
      };

      const personResponse = await axios.post(
        `https://api.pipedrive.com/v1/persons`,
        personData,
        { params: { api_token: apiToken } }
      );
      const personJsonData = personResponse.data;
      if (personJsonData.success) {
        personId = personJsonData.data.id;
      }
    }

    // Create lead
    if (personId && organizationId) {
      const leadData = {
        title: `New Lead from ${data.formName}`,
        person_id: personId,
        organization_id: organizationId,
        "856d510f94582b0d7d7ce7b22628d5287c8d0e6a": data.code,
        "5fd6a4e3043b2f7083183f47c8b3e7ffd71c0c9d": data.designation,
        "e8be7d07dc0a0bd4431410e0ec19fabd918399c2": data.services,
        "3a7721066b0c80c8b0ca26d6219b26980197efa4": data.budget,
        "05ffd2968a78543c2c6092c73ca718f915281197": data.message,
      };

      const leadResponse = await axios.post(
        `https://api.pipedrive.com/v1/leads`,
        leadData,
        { params: { api_token: apiToken } }
      );
      const leadResponseData = leadResponse.data;
      if (leadResponseData.success) {
        res.status(200).json({ message: "Form submitted successfully!" });
      } else {
        res
          .status(500)
          .json({ message: "Failed to submit form.", error: leadResponseData });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing form data", error: error.message });
  }
});

app.post("/api/clutch-bottom-form", async (req, res) => {
  const data = req.body;

  try {
    let organizationId = null;
    let personId = null;

    if (data.company.length >= 2) {
      const searchResponse = await axios.get(
        `https://api.pipedrive.com/v1/organizations/search`,
        {
          params: { term: data.company, api_token: apiToken },
        }
      );
      const searchData = searchResponse.data;
      if (searchData.success && searchData.data.items.length > 0) {
        organizationId = searchData.data.items[0].item.id;
      } else {
        const orgResponse = await axios.post(
          `https://api.pipedrive.com/v1/organizations`,
          { name: data.company },
          { params: { api_token: apiToken } }
        );
        const orgData = orgResponse.data;
        if (orgData.success) {
          organizationId = orgData.data.id;
        }
      }
    }

    if (organizationId) {
      const personData = {
        name: data.name,
        email: [{ value: data.email, primary: true }],
        phone: 123456789,
        org_id: organizationId,
      };

      const personResponse = await axios.post(
        `https://api.pipedrive.com/v1/persons`,
        personData,
        { params: { api_token: apiToken } }
      );
      const personJsonData = personResponse.data;
      if (personJsonData.success) {
        personId = personJsonData.data.id;
      }
    }

    // Create lead
    if (personId && organizationId) {
      const leadData = {
        title: `New Lead from ${data.formName}`,
        person_id: personId,
        organization_id: organizationId,
        "e8be7d07dc0a0bd4431410e0ec19fabd918399c2": data.services,
        "05ffd2968a78543c2c6092c73ca718f915281197": data.message,
      };

      const leadResponse = await axios.post(
        `https://api.pipedrive.com/v1/leads`,
        leadData,
        { params: { api_token: apiToken } }
      );
      const leadResponseData = leadResponse.data;
      if (leadResponseData.success) {
        res.status(200).json({ message: "Form submitted successfully!" });
      } else {
        res
          .status(500)
          .json({ message: "Failed to submit form.", error: leadResponseData });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing form data", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// export { app };
// export const handler = serverless(app);
