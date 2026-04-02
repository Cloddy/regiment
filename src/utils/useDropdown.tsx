// import * as React from 'react';

// const useDropdown = (parentID: string) => {
//   const [dropdownOpen, setDropdownOpen] = React.useState(false);

//   const onToggleDropdown = React.useCallback(() => {
//     if (!window.is_mobile) {
//       return;
//     }

//     setDropdownOpen((open) => !open);
//   }, []);

//   const onCloseDropdown = React.useCallback((event) => {
//     if (event.target.id !== parentID) {
//       setDropdownOpen(false);
//     }
//   }, []);

//   React.useEffect(() => {
//     if (!window.is_mobile) {
//       return;
//     }

//     if (dropdownOpen) {
//       document.addEventListener('click', onCloseDropdown);
//     }

//     return () => {
//       if (dropdownOpen) {
//         document.removeEventListener('click', onCloseDropdown);
//       }
//     };
//   }, [dropdownOpen]);

//   return {
//     dropdownOpen,
//     onToggleDropdown,
//   };
// };

// export default useDropdown;
