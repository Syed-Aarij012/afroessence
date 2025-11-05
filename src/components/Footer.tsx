import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              Adisco <span className="text-accent">Locs</span>
            </h3>
            <p className="text-muted-foreground">
              Professional locs styling and barbershop services in Peckham.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-accent transition-colors">
                About
              </Link>
              <Link to="/gallery" className="block text-muted-foreground hover:text-accent transition-colors">
                Gallery
              </Link>
              <Link to="/booking" className="block text-muted-foreground hover:text-accent transition-colors">
                Book Now
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Opening Hours</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Every Day: 10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p>12 Choumert Rd, London SE15 4SE, United Kingdom</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+447958938820" className="hover:text-accent transition-colors">
                  +44 7958 938820
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@adiscolocs.com" className="hover:text-accent transition-colors">
                  info@adiscolocs.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Adisco Locs Stylist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
