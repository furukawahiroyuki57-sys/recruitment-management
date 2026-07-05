export function createDisclosure(initialOpen = false) {
  let open = initialOpen;

  return {
    isOpen: () => open,
    open: () => {
      open = true;
    },
    close: () => {
      open = false;
    },
    toggle: () => {
      open = !open;
    }
  };
}
