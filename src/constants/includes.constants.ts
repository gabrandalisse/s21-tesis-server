export const PET_FULL_RELATIONS = {
  type: true,
  breed: true,
  size: true,
  color: true,
  sex: true,
  user: {
    include: {
      devices: true,
    },
  },
};

export const USER_WITH_DEVICES = {
  devices: true,
};

export const REPORT_BASE_RELATIONS = {
  pet: {
    include: PET_FULL_RELATIONS,
  },
  reportType: true,
  reportedBy: {
    include: USER_WITH_DEVICES,
  },
};

export const REPORT_FULL_RELATIONS = {
  ...REPORT_BASE_RELATIONS,
  lostMatches: {
    include: {
      foundReport: {
        include: REPORT_BASE_RELATIONS,
      },
    },
  },
  foundMatches: {
    include: {
      lostReport: {
        include: REPORT_BASE_RELATIONS,
      },
    },
  },
};
