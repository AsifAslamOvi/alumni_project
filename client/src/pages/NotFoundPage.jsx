
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { AlertTriangle } from 'lucide-react';

    const NotFoundPage = () => {
      return (
        <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-15rem)] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <AlertTriangle className="w-32 h-32 text-destructive mb-8" />
          </motion.div>
          
          <motion.h1 
            className="text-6xl font-extrabold text-primary mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            404
          </motion.h1>
          <motion.p 
            className="text-2xl text-muted-foreground mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Oops! Page Not Found.
          </motion.p>
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-md"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/">Go to Homepage</Link>
            </Button>
          </motion.div>
        </div>
      );
    };

    export default NotFoundPage;
  