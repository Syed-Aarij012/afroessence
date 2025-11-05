import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const WhiteCard = () => {
  const benefits = [
    "Priority booking for appointments",
    "10% discount on all services",
    "Exclusive access to new styles and techniques",
    "Birthday month special offer",
    "Complimentary hair products",
    "Free consultation sessions",
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-center">White Card Membership</h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Exclusive benefits for our loyal clients
          </p>

          <Card className="mb-8 border-accent">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Premium Membership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">£650</div>
                <p className="text-muted-foreground">per year</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-xl">Membership Benefits:</h3>
                <div className="grid gap-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h4 className="font-semibold mb-2">How It Works</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Sign up for our White Card membership</li>
                  <li>Receive your exclusive membership card</li>
                  <li>Present your card at each appointment</li>
                  <li>Enjoy exclusive benefits and discounts</li>
                </ol>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Contact us to sign up for the White Card membership program
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">How long is the membership valid?</h4>
                <p className="text-muted-foreground">
                  The White Card membership is valid for 12 months from the date of purchase.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I share my membership?</h4>
                <p className="text-muted-foreground">
                  No, the membership is personal and non-transferable.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">How do I renew my membership?</h4>
                <p className="text-muted-foreground">
                  You can renew your membership by contacting us before the expiration date.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhiteCard;
