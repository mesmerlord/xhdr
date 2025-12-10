import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface FreeCreditsReminderEmailProps {
  name: string;
}

export default function FreeCreditsReminderEmail({ name }: FreeCreditsReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your free credits are waiting - Create amazing ads now!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your Free Credits Are Waiting!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We noticed you haven't used your free credits yet! Don't let them go to
            waste - create your first AI-powered advertisement today.
          </Text>
          <Section style={highlightBox}>
            <Text style={highlightText}>
              You have <strong>25 free credits</strong> to get started
            </Text>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href="https://admakeai.com/tools/ad-generator">
              Use Your Free Credits
            </Button>
          </Section>
          <Text style={text}>
            With your free credits, you can:
          </Text>
          <ul style={list}>
            <li style={listItem}>Create multiple professional ad images</li>
            <li style={listItem}>Test different styles and formats</li>
            <li style={listItem}>See the quality of our AI generation</li>
          </ul>
          <Hr style={hr} />
          <Text style={footerText}>
            Questions? Reply to this email or contact us at support@admakeai.com.
          </Text>
          <Text style={footerText}>
            Best regards,
            <br />
            The AdMake AI Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
  textAlign: "center" as const,
  color: "#1a1a1a",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  padding: "0 48px",
};

const highlightBox = {
  backgroundColor: "#fff7ed",
  borderRadius: "8px",
  margin: "24px 48px",
  padding: "16px 24px",
  textAlign: "center" as const,
};

const highlightText = {
  color: "#c2410c",
  fontSize: "18px",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#f97316",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const list = {
  padding: "0 48px",
  color: "#525f7f",
};

const listItem = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "8px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 48px",
};

const footerText = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "20px",
  padding: "0 48px",
};
