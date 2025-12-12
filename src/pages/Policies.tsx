import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Scissors, Package, Users } from "lucide-react";

const Policies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-6">
              Booking Policies
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read our policies carefully before booking your appointment
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 mx-auto mt-6"></div>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {/* Booking Deposit */}
            <Card className="border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 bg-card">
              <CardHeader className="border-b border-amber-500/20">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black shadow-lg">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  Booking Deposit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>There is a <strong className="text-foreground">25% Non-Refundable deposit</strong> required to secure all appointment bookings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Deposits can be used to reschedule missed appointments (terms and conditions apply)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Hair Preparation */}
            <Card className="border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 bg-card">
              <CardHeader className="border-b border-amber-500/20">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black shadow-lg">
                    <Scissors className="h-6 w-6" />
                  </div>
                  Hair Preparation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Please come with your hair <strong className="text-foreground">freshly washed, blow dried, detangled and product free</strong>, unless you want them as an add-on service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Kindly use minimal oil/products where necessary</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="font-semibold text-foreground mb-2">For Braiding Appointments:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Clients may come with their hair already washed and blow-dried only if they prefer to do this themselves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Otherwise, wash and blow-dry services are included with all braiding appointments, so arriving with unwashed or non-blow-dried hair is perfectly fine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Please keep hair free of excessive oils or heavy products before your appointment</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Lateness Policy */}
            <Card className="border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 bg-card">
              <CardHeader className="border-b border-amber-500/20">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black shadow-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  Lateness Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>There is a <strong className="text-foreground">10 minute grace period</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>After the grace period, a <strong className="text-foreground">late fee of £10</strong> will be charged</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Lateness after 30 minutes: appointment will be cancelled and a <strong className="text-foreground">50% fee</strong> will be charged</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Hair Extensions */}
            <Card className="border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 bg-card">
              <CardHeader className="border-b border-amber-500/20">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black shadow-lg">
                    <Package className="h-6 w-6" />
                  </div>
                  Hair Extensions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Hair extensions are provided by us</strong> which makes our prices hair extensions inclusive!
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Select your preferred color from our available list</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Custom colors attract an <strong className="text-foreground">additional £20 fee</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Additional packs for fuller hair: <strong className="text-foreground">£10 per pack</strong></span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="font-semibold text-foreground mb-2">If providing your own extensions:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>No price deductions apply</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Provide <strong className="text-foreground">pre-stretched extensions only</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Non-pre-stretched extensions: drop off 48 hours before or pay £10 fee</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Mixed colors: drop off 48 hours before appointment</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brow & Beauty Treatments */}
            <Card className="border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 bg-card">
              <CardHeader className="border-b border-amber-500/20">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  Brow & Beauty Treatments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>All brow and some beauty treatments require a <strong className="text-foreground">patch test at least 48 hours</strong> prior to appointment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Kindly book "patch test" on our menu alongside these services</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Short Hair & Emergency */}
            <Card className="border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 bg-card">
              <CardHeader className="border-b border-amber-500/20">
                <CardTitle className="text-2xl">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-3">Short Hair</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Please send a picture of your hair before booking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>We only take hair that is <strong className="text-foreground">at least 4 inches</strong></span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-3">Emergency Appointments</h3>
                  <p className="text-muted-foreground">
                    Feel free to email or call us for an emergency appointment which comes at an extra cost
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-3">The Team</h3>
                  <p className="text-muted-foreground">
                    Our hairstylists are all about creating expressive and individual looks.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
