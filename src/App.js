import React,{ Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import LoadingPage from './components/LoadingPage'

const Navbar = lazy(() => import('./components/Navbar'))
const Sidebar = lazy(() => import('./components/Sidebar'))
const Footer = lazy(() => import('./components/Footer'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
//chapters
const ListChapters = lazy(()=> import('./pages/chapters/List'))
const AddChapter = lazy(() => import('./pages/chapters/AddChapter'))
//courses
const ListCourses = lazy(()=> import('./pages/courses/List'))
const AddCourses = lazy(() => import('./pages/courses/AddCourses'))

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<LoadingPage />}>
          <Navbar />
          <Sidebar />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/list-chapters' component={ListChapters} />
          <Route path='/add-chapters' component={AddChapter} />
          <Route path='/list-courses' component={ListCourses} />
          <Route path='/add-courses' component={AddCourses} />
          <Footer />  
        </Suspense>
      </Router>
    </>
  );
}

export default App;
