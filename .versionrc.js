export default {
  writer: {
    commitsSort: (a, b) => {
      // Sort by committerDate descending (newest first)
      if (a.committerDate && b.committerDate) {
        return b.committerDate.localeCompare(a.committerDate);
      }
      return 0;
    }
  }
};
