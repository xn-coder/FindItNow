
export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto prose dark:prose-invert">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Terms & Conditions</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <h2>1. Agreement to Terms</h2>
      <p>
        By using our services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the services.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        FindItNow provides a platform for users to report and search for lost and found items. We are a neutral venue and are not directly involved in the exchanges between users.
      </p>

      <h2>3. User Conduct</h2>
      <p>
        You agree not to use the service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the service in any way that could damage the service, the reputation of FindItNow, or the general business of FindItNow.
      </p>
      
      <h2>4. Disclaimers</h2>
      <p>
        Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee the accuracy, completeness, or usefulness of any information on the service and neither adopt nor endorse nor are responsible for the accuracy or reliability of any opinion, advice, or statement made.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        FindItNow shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses.
      </p>

      <h2>6. Governing Law</h2>
      <p>
        These Terms shall be governed by the laws of the jurisdiction in which the company is based, without regard to its conflict of law provisions.
      </p>

    </div>
  );
}
