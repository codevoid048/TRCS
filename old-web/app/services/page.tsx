"use client"

import { motion } from "framer-motion";
import { 
  Wrench, 
  Settings, 
  Sparkles, 
  Shield, 
  Clock, 
  Award,
  CheckCircle,
  Bike,
  Zap,
  Package,
  Phone,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Services = () => {
  const services = [
    {
      icon: Wrench,
      title: "Expert Repairs",
      description: "Professional repair services for all types of bicycles. From flat tires to complex mechanical issues.",
      features: ["Brake Adjustments", "Gear Tuning", "Wheel Truing", "Chain Replacement"],
      image: "/service-maintenance.webp",
      price: "Starting ₹199"
    },
    {
      icon: Settings,
      title: "Complete Tune-Ups",
      description: "Comprehensive maintenance packages to keep your bike running smoothly all year round.",
      features: ["Full Inspection", "Brake & Gear Service", "Chain Lubrication", "Wheel Alignment"],
      image: "/services-hero.webp",
      price: "Starting ₹499"
    },
    {
      icon: Sparkles,
      title: "Custom Assembly",
      description: "Build your dream bike with our expert assembly and customization services.",
      features: ["Custom Builds", "Component Upgrades", "Performance Parts", "Personal Fitting"],
      image: "/service-custom.webp",
      price: "Starting ₹999"
    }
  ];

  const additionalServices = [
    {
      icon: Shield,
      title: "Safety Inspections",
      description: "Thorough safety checks to ensure your bike is road-ready"
    },
    {
      icon: Zap,
      title: "Emergency Repairs",
      description: "Quick turnaround for urgent repair needs"
    },
    {
      icon: Package,
      title: "Parts & Accessories",
      description: "Premium quality parts and accessories available"
    },
    {
      icon: Award,
      title: "Warranty Service",
      description: "Authorized service center with warranty support"
    }
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: "45+ Years Experience",
      text: "Trusted expertise since 1982"
    },
    {
      icon: Award,
      title: "Certified Technicians",
      text: "Professionally trained mechanics"
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      text: "All services backed by warranty"
    },
    {
      icon: Zap,
      title: "Quick Turnaround",
      text: "Most repairs completed same day"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0">
          <Image 
            src="/services-hero.webp"
            alt="Professional Cycle Services" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Professional Cycle Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-body">
              Expert maintenance, repairs, and customization for all your cycling needs
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary-main to-secondary-main hover:from-primary-dark hover:to-secondary-dark text-white text-lg"
              onClick={() => document.getElementById('services-list')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section id="services-list" className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            From routine maintenance to custom builds, we've got you covered
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <service.icon className="h-10 w-10 mb-2" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 font-body">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-body">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex flex-col-1 sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => window.location.href = '/contact'}
                      >
                        Enquire Now
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                        onClick={() => window.open('https://wa.me/918688432642?text=Hi, I would like to know more about ' + service.title, '_blank')}
                      >
                        <span className="hidden sm:inline">Chat on WhatsApp</span>
                        <span className="sm:hidden">WhatsApp</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">Additional Services</h2>
            <p className="text-xl text-muted-foreground font-body">
              More ways we can help keep you riding
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                  <service.icon className="h-12 w-12 text-primary-main mb-4" />
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground font-body">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground font-body">
            Trusted by cyclists across Vijayawada for over four decades
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary-main/10 to-secondary-main/10 mb-4">
                <item.icon className="h-10 w-10 text-primary-main" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground font-body">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-main to-secondary-main text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Bike className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Ready to Service Your Bike?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 font-body">
              Visit us today or call to schedule an appointment. Our expert technicians are ready to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg bg-white text-primary-main hover:bg-gray-100"
                onClick={() => window.location.href = 'tel:+918688432642'}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now: +91 86884 32642
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg border-white text-primary-main hover:bg-white hover:text-primary-main transition-all duration-300"
                onClick={() => window.location.href = '/contact'}
              >
                Visit Our Store
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Hours */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-around items-center gap-8 text-center">
            <div>
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary-main" />
              <h3 className="font-bold mb-1">Service Hours</h3>
              {/* <p className="text-muted-foreground font-body">Mon-Sat: 10:00 AM - 9:00 PM</p> */}
              <p className="text-muted-foreground font-body">Saturday 11:00 AM - 6:00 PM</p>
            </div>
            <div>
              <Phone className="h-8 w-8 mx-auto mb-2 text-primary-main" />
              <h3 className="font-bold mb-1">Contact Us</h3>
              <p className="text-muted-foreground font-body">+91 86884 32642</p>
              <p className="text-muted-foreground font-body">therajacyclestores@gmail.com</p>
            </div>
            <div>
              <Award className="h-8 w-8 mx-auto mb-2 text-primary-main" />
              <h3 className="font-bold mb-1">Best Rated</h3>
              <p className="text-muted-foreground font-body">4.5/5 Stars</p>
              <p className="text-muted-foreground font-body">Vijayawada's #1 Choice</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;