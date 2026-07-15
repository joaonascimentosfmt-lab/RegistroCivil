import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PeopleModule } from './modules/people/people.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { ProtocolsModule } from './modules/protocols/protocols.module';
import { ServicesModule } from './modules/services/services.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { RulesEngineModule } from './modules/rules-engine/rules-engine.module';
import { SiscoafModule } from './modules/siscoaf/siscoaf.module';
import { DecisionTreeModule } from './modules/decision-tree/decision-tree.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { FinanceModule } from './modules/finance/finance.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    PeopleModule,
    PropertiesModule,
    ProtocolsModule,
    ServicesModule,
    ChecklistModule,
    DocumentsModule,
    RulesEngineModule,
    SiscoafModule,
    DecisionTreeModule,
    DashboardModule,
    ReportsModule,
    AuditModule,
    FinanceModule,
    NotificationsModule,
  ],
})
export class AppModule {}
