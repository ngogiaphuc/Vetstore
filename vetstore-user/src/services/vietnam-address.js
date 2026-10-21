let cachedProvinces = null;

/**
 * Fetch list of all 63 Vietnam provinces & cities with districts
 */
export async function getVietnamProvinces() {
  if (cachedProvinces) return cachedProvinces;
  try {
    const response = await fetch('https://provinces.open-api.vn/api/?depth=2');
    if (!response.ok) throw new Error('Failed to fetch provinces');
    const data = await response.json();
    cachedProvinces = data.map((p) => ({
      code: p.code,
      name: p.name,
      districts: (p.districts || []).map((d) => ({
        code: d.code,
        name: d.name,
      })),
    }));
    return cachedProvinces;
  } catch (error) {
    console.error('Error loading Vietnam provinces:', error);
    // Fallback data if offline or API error
    return [
      {
        code: 79,
        name: 'Thành phố Hồ Chí Minh',
        districts: [
          { code: 760, name: 'Quận 1' },
          { code: 761, name: 'Quận 12' },
          { code: 769, name: 'Thủ Đức' },
          { code: 770, name: 'Quận Bình Thạnh' },
          { code: 771, name: 'Quận Gò Vấp' },
        ],
      },
      {
        code: 1,
        name: 'Thành phố Hà Nội',
        districts: [
          { code: 1, name: 'Quận Ba Đình' },
          { code: 2, name: 'Quận Hoàn Kiếm' },
          { code: 3, name: 'Quận Tây Hồ' },
          { code: 4, name: 'Quận Cầu Giấy' },
        ],
      },
      {
        code: 48,
        name: 'Thành phố Đà Nẵng',
        districts: [
          { code: 490, name: 'Quận Hải Châu' },
          { code: 491, name: 'Quận Thanh Khê' },
          { code: 492, name: 'Quận Sơn Trà' },
        ],
      },
    ];
  }
}