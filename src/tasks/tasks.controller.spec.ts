import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn().mockImplementation((userId, projectId, dto) => ({
      userId,
      projectId,
      ...dto,
      id: 'someTaskId',
    })),
    findAll: jest.fn().mockImplementation((filter, sort) => [
      {
        id: '1',
        userId: 'someUserId',
        projectId: 'someProjectId',
        title: 'Test Task 1',
        description: 'Description 1',
        status: TaskStatus.New,
      },
    ]),
    findOne: jest.fn().mockImplementation((id) => ({
      id,
      userId: 'someUserId',
      projectId: 'someProjectId',
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.New,
    })),
    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn().mockImplementation((id) => ({
      id,
      deleted: true,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Description',
        status: TaskStatus.New,
      };
      expect(
        await controller.create('someUserId', 'someProjectId', dto),
      ).toEqual({
        userId: 'someUserId',
        projectId: 'someProjectId',
        ...dto,
        id: 'someTaskId',
      });
      expect(service.create).toHaveBeenCalledWith(
        'someUserId',
        'someProjectId',
        dto,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const query = {
        status: TaskStatus.New,
        sortBy: 'createdAt',
        order: 'asc',
      };
      const filter = {
        userId: 'someUserId',
        projectId: 'someProjectId',
        status: TaskStatus.New,
      };
      const sort = { createdAt: 1 };

      expect(
        await controller.findAll(
          'someUserId',
          'someProjectId',
          query.status,
          query.sortBy,
          query.order,
          undefined,
        ),
      ).toEqual([
        {
          id: '1',
          userId: 'someUserId',
          projectId: 'someProjectId',
          title: 'Test Task 1',
          description: 'Description 1',
          status: TaskStatus.New,
        },
      ]);
      expect(service.findAll).toHaveBeenCalledWith(filter, sort);
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      expect(await controller.findOne('someTaskId')).toEqual({
        id: 'someTaskId',
        userId: 'someUserId',
        projectId: 'someProjectId',
        title: 'Test Task',
        description: 'Description',
        status: TaskStatus.New,
      });
      expect(service.findOne).toHaveBeenCalledWith('someTaskId');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const dto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };
      expect(await controller.update('someTaskId', dto)).toEqual({
        id: 'someTaskId',
        ...dto,
      });
      expect(service.update).toHaveBeenCalledWith('someTaskId', dto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      expect(await controller.remove('someTaskId')).toEqual({
        id: 'someTaskId',
        deleted: true,
      });
      expect(service.remove).toHaveBeenCalledWith('someTaskId');
    });
  });
});
