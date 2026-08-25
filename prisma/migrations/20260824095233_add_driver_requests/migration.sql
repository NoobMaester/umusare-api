-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DRIVER_ARRIVING', 'STARTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "DriverRequest" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "assignedDriverId" TEXT,
    "pickupAddress" TEXT NOT NULL,
    "pickupLatitude" DECIMAL(65,30) NOT NULL,
    "pickupLongitude" DECIMAL(65,30) NOT NULL,
    "destinationAddress" TEXT NOT NULL,
    "destinationLatitude" DECIMAL(65,30) NOT NULL,
    "destinationLongitude" DECIMAL(65,30) NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "DriverRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DriverRequest" ADD CONSTRAINT "DriverRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRequest" ADD CONSTRAINT "DriverRequest_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "CustomerVehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
