export const mockUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  createUser: jest.fn(),
};

export const mockTokenService = {
  sign: jest.fn(),
  verify: jest.fn(),
};
