import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fake/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashRepository,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashRepository,
    );

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndo@example.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'johndo@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashRepository = new FakeHashRepository();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashRepository,
    );

    expect(
      authenticateUser.execute({
        email: 'johndo@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashRepository,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashRepository,
    );

    await createUserService.execute({
      name: 'John Doe',
      email: 'johndo@example.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'johndo@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
