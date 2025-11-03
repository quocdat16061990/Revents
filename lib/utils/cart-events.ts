// Utility function to dispatch cart update event
export const dispatchCartUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }
};
