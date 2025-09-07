
    import React from 'react';
    import { Outlet } from 'react-router-dom';
    import Header from '@/components/layout/Header';
    import Footer from '@/components/layout/Footer';
    import { motion } from 'framer-motion';

    const MainLayout = () => {
      return (
        <>
          <Header />
          <motion.main 
            className="flex-grow container mx-auto px-4 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.main>
          <Footer />
        </>
      );
    };

    export default MainLayout;
  