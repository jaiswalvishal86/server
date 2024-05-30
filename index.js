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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// export { app };
// export const handler = serverless(app);
