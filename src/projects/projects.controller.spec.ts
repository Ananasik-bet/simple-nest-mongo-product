import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProjectService = {
    create: jest.fn().mockImplementation((userId, dto) => ({
      userId,
      ...dto,
      id: 'someId',
    })),
    findAllByUserId: jest.fn().mockImplementation((userId) => [
      {
        id: '1',
        userId,
        name: 'Test Project 1',
        description: 'Description 1',
      },
    ]),
    findOne: jest.fn().mockImplementation((id) => ({
      id,
      userId: 'someUserId',
      name: 'Test Project',
      description: 'Description',
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
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const dto: CreateProjectDto = {
        name: 'Test Project',
        description: 'Description',
      };
      expect(await controller.create('someUserId', dto)).toEqual({
        userId: 'someUserId',
        ...dto,
        id: 'someId',
      });
      expect(service.create).toHaveBeenCalledWith('someUserId', dto);
    });
  });

  describe('findAllByUserId', () => {
    it('should return an array of projects', async () => {
      expect(await controller.findAllByUserId('someUserId')).toEqual([
        {
          id: '1',
          userId: 'someUserId',
          name: 'Test Project 1',
          description: 'Description 1',
        },
      ]);
      expect(service.findAllByUserId).toHaveBeenCalledWith('someUserId');
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      expect(await controller.findOne('someProjectId')).toEqual({
        id: 'someProjectId',
        userId: 'someUserId',
        name: 'Test Project',
        description: 'Description',
      });
      expect(service.findOne).toHaveBeenCalledWith('someProjectId');
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
        description: 'Updated Description',
      };
      expect(await controller.update('someProjectId', dto)).toEqual({
        id: 'someProjectId',
        ...dto,
      });
      expect(service.update).toHaveBeenCalledWith('someProjectId', dto);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      expect(await controller.remove('someProjectId')).toEqual({
        id: 'someProjectId',
        deleted: true,
      });
      expect(service.remove).toHaveBeenCalledWith('someProjectId');
    });
  });
});
