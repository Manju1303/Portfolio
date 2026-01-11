import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Globe, Terminal } from 'lucide-react';

const About = () => {
    const cards = [
        {
            icon: <Brain className="text-primary" size={32} />,
            title: "AI & Agents",
            desc: "Building autonomous systems and LLM-powered applications using modern pipelines."
        },
        {
            icon: <Code className="text-secondary" size={32} />,
            title: "Vibe Coder",
            desc: "Blending technical precision with intuitive, premium user-focused product design."
        }
        {
            icon: <Globe className="text-green-400" size={32} />,
            title: "Distributed Systems",
            desc: "Experience with cloud networking, sensor networks, and edge computing simulations."
        }
    ];

    return (
        <section id="about" className="section-padding relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">About <span className="gradient-text">Me</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A B.Tech graduate in Artificial Intelligence and Data Science, combining applied engineering with creative development.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="glass-panel p-8 hover:bg-white/5 transition-colors"
                        >
                            <div className="mb-4 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {card.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 p-8 glass-panel border-l-4 border-l-primary"
                >
                    <p className="text-lg text-gray-300 italic leading-relaxed">
                        "I am driven by automation, innovation, and emerging AI technologies, aiming to build intelligent products that accelerate learning, enhance usability, and make advanced systems accessible for everyday digital workflows."
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
