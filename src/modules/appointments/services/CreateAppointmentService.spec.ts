import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '121212123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('121212123');
  });

  it('should not be able two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 12);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '121212123',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '121212123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
