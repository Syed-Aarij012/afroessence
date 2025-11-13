import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { Card3D } from "@/components/3D/Card3D";
import { AnimatedBackground } from "@/components/3D/AnimatedBackground";
import { AlertCircle } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            phone: signUpData.phone,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        if (error.message.includes("Demo mode")) {
          toast.info("Demo mode active - backend connection needed for signup");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! You can now sign in.");
      setSignUpData({ email: "", password: "", fullName: "", phone: "" });
    } catch (error: any) {
      console.log("Signup error handled gracefully");
      toast.info("Backend connection needed for account creation");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) {
        if (error.message.includes("Demo mode")) {
          toast.info("Demo mode active - backend connection needed for signin");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.log("Signin error handled gracefully");
      toast.info("Backend connection needed for authentication");
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return null;
  }

  return (
    <AnimatedBackground>
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center relative">
        <ParticleBackground />
        
        {/* Background decorations */}
        <GradientOrb size={300} className="top-20 left-10 opacity-20" />
        <GradientOrb size={200} color="primary" className="bottom-20 right-20 opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <FloatingElement delay={0}>
              <Card3D className="backdrop-blur-sm bg-card/90 border-border/50">
                <CardHeader>
                  <CardTitle className="text-3xl text-center bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                    Welcome
                  </CardTitle>
                  <CardDescription className="text-center">
                    Sign in or create an account to book appointments
                  </CardDescription>
                  
                  {/* Backend status indicator */}
                  <div className="flex items-center justify-center gap-2 mt-2 p-2 bg-muted/50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Demo mode - backend connection needed for full functionality
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="signin">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50 backdrop-blur-sm">
                      <TabsTrigger 
                        value="signin"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-300"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger 
                        value="signup"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-300"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                      <FloatingElement delay={0.3}>
                        <form onSubmit={handleSignIn} className="space-y-4">
                          <div>
                            <Input
                              type="email"
                              placeholder="Email"
                              value={signInData.email}
                              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                              required
                              className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                            />
                          </div>
                          <div>
                            <Input
                              type="password"
                              placeholder="Password"
                              value={signInData.password}
                              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                              required
                              className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg" 
                            disabled={loading}
                          >
                            {loading ? "Signing in..." : "Sign In"}
                          </Button>
                        </form>
                      </FloatingElement>
                    </TabsContent>

                    <TabsContent value="signup">
                      <FloatingElement delay={0.3}>
                        <form onSubmit={handleSignUp} className="space-y-4">
                          <div>
                            <Input
                              placeholder="Full Name"
                              value={signUpData.fullName}
                              onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                              required
                              className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                            />
                          </div>
                          <div>
                            <Input
                              type="email"
                              placeholder="Email"
                              value={signUpData.email}
                              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                              required
                              className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                            />
                          </div>
                          <div>
                            <Input
                              type="tel"
                              placeholder="Phone (optional)"
                              value={signUpData.phone}
                              onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                              className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                            />
                          </div>
                          <div>
                            <Input
                              type="password"
                              placeholder="Password (min 6 characters)"
                              value={signUpData.password}
                              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                              required
                              minLength={6}
                              className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg" 
                            disabled={loading}
                          >
                            {loading ? "Creating account..." : "Sign Up"}
                          </Button>
                        </form>
                      </FloatingElement>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card3D>
            </FloatingElement>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Auth;
