import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarEventsService } from './calendar-events.service';
import {
  CreateCalendarEventDto,
  FindEventsParamsDto,
} from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@ApiTags('CalendarEvents')
@ApiBearerAuth()
@Controller('calendar-events')
@UseGuards(JwtAuthGuard)
export class CalendarEventsController {
  constructor(private readonly service: CalendarEventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @UsePipes(new ZodValidationPipe(CreateCalendarEventDto.schema))
  create(@Body() dto: CreateCalendarEventDto) {
    return this.service.create(dto);
  }

  @Post('bulk/:calendarId')
  @ApiOperation({ summary: 'Create multiple events for a calendar' })
  @ApiParam({ name: 'calendarId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Events created successfully' })
  createMany(
    @Param('calendarId') calendarId: string,
    @Body() events: Omit<CreateCalendarEventDto, 'calendarId'>[],
  ) {
    return this.service.createMany(calendarId, events);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event found' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('calendar/:calendarId')
  @ApiOperation({ summary: 'List events by calendar' })
  @ApiParam({ name: 'calendarId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'eventType', required: false, type: String })
  @ApiQuery({ name: 'isAvailable', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, type: String })
  findByCalendarId(
    @Param('calendarId') calendarId: string,
    @Query(new ZodValidationPipe(FindEventsParamsDto.schema))
    query: FindEventsParamsDto,
  ) {
    return this.service.findByCalendarId(calendarId, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update calendar event' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @UsePipes(new ZodValidationPipe(UpdateCalendarEventDto.schema))
  update(@Param('id') id: string, @Body() dto: UpdateCalendarEventDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete calendar event' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Delete('bulk')
  @ApiOperation({ summary: 'Delete multiple events by IDs' })
  @ApiResponse({ status: 200, description: 'Events deleted successfully' })
  deleteMany(@Body() ids: string[]) {
    return this.service.deleteMany(ids);
  }

  @Get('calendar/:calendarId/slots')
  @ApiOperation({ summary: 'Find available slots in a calendar' })
  @ApiParam({ name: 'calendarId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiQuery({ name: 'duration', required: true, type: Number })
  findAvailableSlots(
    @Param('calendarId') calendarId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('duration') duration: number,
  ) {
    return this.service.findAvailableSlots(
      calendarId,
      new Date(startDate),
      new Date(endDate),
      Number(duration),
    );
  }

  @Delete('calendar/:calendarId/clean')
  @ApiOperation({ summary: 'Clean old events from a calendar' })
  @ApiParam({ name: 'calendarId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'beforeDate', required: true, type: String })
  cleanOldEvents(
    @Param('calendarId') calendarId: string,
    @Query('beforeDate') beforeDate: string,
  ) {
    return this.service.cleanOldEvents(calendarId, new Date(beforeDate));
  }

  @Get('calendar/:calendarId/stats')
  @ApiOperation({ summary: 'Get event statistics for a calendar' })
  @ApiParam({ name: 'calendarId', type: 'string', format: 'uuid' })
  getEventStats(@Param('calendarId') calendarId: string) {
    return this.service.getEventStats(calendarId);
  }
}
