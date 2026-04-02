const getNumberProperty = (propertyName: string): number => {
  const computedStyle = getComputedStyle(document.documentElement).getPropertyValue(propertyName);

  return computedStyle ? Number.parseInt(computedStyle) : 0;
};

/**
 * Возвращает высоту верхней безопасной области в пикселях.
 * Использует переменную vkui --safe-area-inset-top.
 */
export const getTopSafeArea = (): number => getNumberProperty('--safe-area-inset-top');
