// Admin Panel Verification Script
// Run this in browser console to verify admin functionality

console.log('🔍 Admin Panel Verification Starting...');

// Check if we're on the admin interface
const isAdminInterface = () => {
  const adminBranding = document.querySelector('nav a[href="/admin"]');
  const adminPanel = document.querySelector('h1');
  return adminBranding && adminPanel && adminPanel.textContent.includes('Admin');
};

// Check if user navigation is hidden
const isUserNavHidden = () => {
  const bookNowButton = document.querySelector('a[href="/booking"]');
  const homeLink = document.querySelector('a[href="/"]');
  const aboutLink = document.querySelector('a[href="/about"]');
  return !bookNowButton && !homeLink && !aboutLink;
};

// Check if admin tabs are present
const hasAdminTabs = () => {
  const tabs = document.querySelectorAll('[role="tablist"] button');
  const tabTexts = Array.from(tabs).map(tab => tab.textContent.toLowerCase());
  return tabTexts.includes('customers') && 
         tabTexts.includes('bookings') && 
         tabTexts.includes('services');
};

// Check if search functionality exists
const hasSearchFunction = () => {
  const searchInput = document.querySelector('input[placeholder*="Search"]');
  return !!searchInput;
};

// Run verification
setTimeout(() => {
  console.log('📊 Verification Results:');
  console.log('✅ Admin Interface:', isAdminInterface() ? 'PASS' : 'FAIL');
  console.log('✅ User Nav Hidden:', isUserNavHidden() ? 'PASS' : 'FAIL');
  console.log('✅ Admin Tabs Present:', hasAdminTabs() ? 'PASS' : 'FAIL');
  console.log('✅ Search Function:', hasSearchFunction() ? 'PASS' : 'FAIL');
  
  const allPassed = isAdminInterface() && isUserNavHidden() && hasAdminTabs() && hasSearchFunction();
  console.log('🎉 Overall Status:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  if (allPassed) {
    console.log('🚀 Admin panel is working correctly!');
  } else {
    console.log('🔧 Please check the setup steps again.');
  }
}, 2000);

console.log('⏳ Running verification in 2 seconds...');