import {
  loginSchema,
  registerSchema,
  userUpdateSchema,
  userAdminUpdateSchema,
} from '@/lib/validators/auth';
import { orderCreateSchema } from '@/lib/validators/order';
import { productSchema } from '@/lib/validators/product';

describe('Validation Schemas', () => {
  describe('Auth Validators', () => {
    it('validates login schema correctly', () => {
      // Valid
      expect(
        loginSchema.safeParse({ email: 'test@example.com', password: 'password' }).success
      ).toBe(true);

      // Invalid Email
      const invalidEmail = loginSchema.safeParse({ email: 'not-an-email', password: 'password' });
      expect(invalidEmail.success).toBe(false);
      if (!invalidEmail.success) {
        expect(invalidEmail.error.issues[0].message).toBe('Invalid email address');
      }

      // Empty Password
      const emptyPass = loginSchema.safeParse({ email: 'test@example.com', password: '' });
      expect(emptyPass.success).toBe(false);
    });

    it('validates register schema correctly', () => {
      // Valid
      expect(
        registerSchema.safeParse({
          name: 'John',
          email: 'test@example.com',
          password: 'password123',
        }).success
      ).toBe(true);

      // Short Name
      const shortName = registerSchema.safeParse({
        name: 'J',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(shortName.success).toBe(false);

      // Short Password
      const shortPass = registerSchema.safeParse({
        name: 'John',
        email: 'test@example.com',
        password: '123',
      });
      expect(shortPass.success).toBe(false);
    });

    it('validates user update schema correctly', () => {
      // Valid Partial Update
      expect(userUpdateSchema.safeParse({ name: 'New Name' }).success).toBe(true);
      expect(userUpdateSchema.safeParse({ email: 'new@example.com' }).success).toBe(true);
      expect(userUpdateSchema.safeParse({}).success).toBe(true); // Optional fields

      // Invalid Email update
      expect(userUpdateSchema.safeParse({ email: 'bad-email' }).success).toBe(false);
    });

    it('validates admin user update schema correctly', () => {
      // Valid
      expect(userAdminUpdateSchema.safeParse({ isAdmin: true, name: 'Admin User' }).success).toBe(
        true
      );
    });
  });

  describe('Order Validators', () => {
    const validOrder = {
      orderItems: [
        {
          name: 'Product 1',
          qty: 1,
          image: '/img.jpg',
          price: 10,
          product: '507f1f77bcf86cd799439011',
        },
      ],
      shippingAddress: {
        address: '123 St',
        city: 'City',
        postalCode: '12345',
        country: 'Country',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 10,
      taxPrice: 2,
      shippingPrice: 5,
      totalPrice: 17,
    };

    it('validates valid order', () => {
      expect(orderCreateSchema.safeParse(validOrder).success).toBe(true);
    });

    it('validates order with guest info', () => {
      const guestOrder = {
        ...validOrder,
        guestInfo: { name: 'Guest', email: 'guest@example.com' },
      };
      expect(orderCreateSchema.safeParse(guestOrder).success).toBe(true);
    });

    it('fails on negative prices', () => {
      const invalidOrder = { ...validOrder, itemsPrice: -10 };
      expect(orderCreateSchema.safeParse(invalidOrder).success).toBe(false);
    });

    it('fails on missing order items', () => {
      const invalidOrder = { ...validOrder, orderItems: [] };
      const res = orderCreateSchema.safeParse(invalidOrder);
      expect(res.success).toBe(false);
    });

    it('fails on invalid shipping address', () => {
      const invalidOrder = {
        ...validOrder,
        shippingAddress: { address: '', city: 'City', postalCode: '12345', country: 'Country' },
      };
      expect(orderCreateSchema.safeParse(invalidOrder).success).toBe(false);
    });
  });

  describe('Product Validators', () => {
    const validProduct = {
      name: 'Product Name',
      price: 100,
      image: '/image.jpg',
      brand: 'BrandX',
      category: 'Electronics',
      countInStock: 10,
      description: 'Cool product',
    };

    it('validates valid product', () => {
      expect(productSchema.safeParse(validProduct).success).toBe(true);
    });

    it('fails on negative price', () => {
      expect(productSchema.safeParse({ ...validProduct, price: -5 }).success).toBe(false);
    });

    it('fails on negative stock', () => {
      expect(productSchema.safeParse({ ...validProduct, countInStock: -1 }).success).toBe(false);
    });

    it('fails on missing required fields', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, ...missingName } = validProduct;
      expect(productSchema.safeParse(missingName).success).toBe(false);
    });
  });
});
