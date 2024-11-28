import { Organization } from '@prisma/client';
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { text } from 'stream/consumers';

interface InviteEmailProps {
  token: string;
  baseUrl: string;
  organizationName: Organization['name'];
  organizationHashid: string;
}

export const InviteEmail = ({
  token,
  baseUrl,
  organizationName,
  organizationHashid,
}: InviteEmailProps) => (
  <Html>
    <Head />
    <Preview>This invitation expires after 5 days</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Img
          src={`${BASE_URL}/static/github.png`}
          width='32'
          height='32'
          alt='Github'
        /> */}

        <Text style={title}>
          <strong>{organizationName}</strong> has invited you to join their
          organization on <span style={veras}>VERAS</span>.
        </Text>

        <Section style={section}>
          <Link
            style={button}
            href={`${baseUrl}/${organizationHashid}/invite/${token}`}
          >
            Join {organizationName}
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

InviteEmail.PreviewProps = {
  organizationHashid: 'hashid',
  organizationName: 'Microsoft',
  baseUrl: 'https://localhost:3000',
  token: 'token',
} as InviteEmailProps;

export default InviteEmail;

const veras = {
  color: '#d66565',
  background:
    '-webkit-linear-gradient(45deg, hsl(225 79.2% 81.2%), hsl(221 59.5% 71%), hsl(224 46.7% 61%), hsl(227 39.2% 51%), hsl(228 49.8% 40.6%))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
};

const main = {
  backgroundColor: 'transparent',
  color: '#24292e',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const title = {
  fontSize: '24px',
  lineHeight: 1.25,
  textAlign: 'center' as const,
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
};

const button = {
  fontSize: '14px',
  backgroundColor: '#222',
  background: 'linear-gradient(45deg, #222, #444)',
  color: '#fff',
  lineHeight: 1.5,
  borderRadius: '0.5em',
  padding: '12px 24px',
  '&:hover': {
    background: 'red',
  },
};
