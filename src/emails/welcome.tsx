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

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to AdMake AI - Create stunning ads with AI</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to AdMake AI!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Welcome to AdMake AI! We're excited to have you on board. You now have
            access to our powerful AI tools to create stunning advertisement images
            for your business.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href="https://admakeai.com/tools/ad-generator">
              Create Your First Ad
            </Button>
          </Section>
          <Text style={text}>
            Here's what you can do with AdMake AI:
          </Text>
          <ul style={list}>
            <li style={listItem}>Generate professional ad images from text descriptions</li>
            <li style={listItem}>Edit and enhance your product photos</li>
            <li style={listItem}>Create ads optimized for different platforms</li>
            <li style={listItem}>Save time and money on ad creation</li>
          </ul>
          <Hr style={hr} />
          <Text style={footerText}>
            If you have any questions, feel free to reply to this email or contact
            us at support@admakeai.com.
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
