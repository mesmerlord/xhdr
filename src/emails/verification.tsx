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

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export default function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for AdMake AI</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Verify Your Email</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thanks for signing up for AdMake AI! Please verify your email address
            by clicking the button below.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
          </Section>
          <Text style={text}>
            This link will expire in 24 hours. If you didn't create an account with
            us, you can safely ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footerText}>
            If the button doesn't work, copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>{verificationUrl}</Text>
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

const linkText = {
  color: "#f97316",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
  wordBreak: "break-all" as const,
};
